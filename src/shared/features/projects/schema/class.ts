import { EnrichedEnvelopeFromCore, Envelope } from "@/shared/schema";
import { EnrichedProject, projectEnvelopeCodec, SerialisedProject, serialisedProjectSchema } from "./core";
import { reduceObjectChanges } from "@/shared/utilities";
import { getRelativeTimeStringNow } from "@/shared/lib/temporal";


// Class will deal with basic envelope serialisation and deserialisation.

// ONLY deals with basic serialised data.
abstract class AbstractEnvelope<
  T extends Envelope
> {
  // private initial: T;
  private changes: Partial<T['data']>;
  private current: T['data'];

  constructor(protected initial: T) {
    // No changes initially.
    this.changes = {};
    this.current = initial.data;
  }

  get id() {
    return this.initial.id;
  }

  // TODO: Setter for partial changes.
  protected set serialise(val: Partial<T['data']>) {
    this.changes = reduceObjectChanges<T['data']>(this.current, val);
    this.current = { ...this.current, ...this.changes };
  }

  get state() {
    return {
      // Spreading to avoid accidental mutation of the internal state.
      changes: { ...this.changes },
      current: { ...this.current },
    }
  }
  // TODO: A function which basically sets initial to be whatever current is set to.
  // This would be run if the object is supposed to continue being stored after
  // the data has been saved, rather than being treated disposably to be re-read from the backend.
  checkpoint() {
    this.initial.data = this.current;
    this.changes = {};
  }
  // Maybe a function that just creates a new one from the current state?
  snapshot(): T {
    // Also need to apply an updated version of the audit.
    return { ...this.initial, data: this.current };
  }
}

// TODO: Audit strategy.
// EnrichedProject = {
//     name: string;
//     path: string;
//     git: "unknown" | {
//         totalStagedFiles: number;
//         commitDates: Temporal.ZonedDateTime[];
//         earliestCommitDate: Temporal.ZonedDateTime;
//         lastCheck: Temporal.ZonedDateTime;
//         latestCommitDate: Temporal.ZonedDateTime;
//     } | "none";
// }

// We should start by deprecating the path and moving it to "local".
// Technically we don't need to map this to a machine IF we remember when we
// come to the backup/restore strategy that local project data will vary.
// The `local` object is optional and can just have a `path` string for now
// (which just so happens to have the same string, so we'll write a transformer
// for migration).
// `git` will need to be able to handle remote/local later, but we don't need to
// worry about it rn.
// Ultimately an empty project name is generated based on a local path folder
// name.
// Name changes should absolutely appear in the audit log, but we have no way
// to change the name right now anyway, so that can wait until it can be edited.
// Later, git remote url or local existence should absolutely appear in the
// audit log, but the git object will need a refactor first.
// At this point the "audit strategy" looks like it might just be a list of root
// property keys, e.g. "name" in this case.

export class ProjectEnvelope extends AbstractEnvelope<SerialisedProject> {
  // IDK if this is right yet, but this should only be modifiable from inside
  // the instance.
  readonly enrichedProject: EnrichedEnvelopeFromCore<EnrichedProject>;
  constructor(
    initial: SerialisedProject
  ) {
    super(initial);
    this.enrichedProject = projectEnvelopeCodec.decode(initial);
  }

  static from(data: SerialisedProject): ProjectEnvelope;
  static from(data?: SerialisedProject[]): ProjectEnvelope[];
  static from(data: undefined): ProjectEnvelope[];
  // static from(data: unknown): ProjectEnvelope | ProjectEnvelope[];
  static from(data: unknown) {
    // Envelope has to go through a populating parser because we don't know if
    // we can trust the data coming from a database, for example.
    if (Array.isArray(data)) {
      return data.map((d) => new ProjectEnvelope(d));
    }
    if (data === undefined) return [];
    return new ProjectEnvelope(serialisedProjectSchema.parse(data));
  }

  // We have a project object, but we update it from a serialised version.
  // from(data: SerialisedProject): ProjectEnvelope;
  // from(data: undefined): ProjectEnvelope;
  from(data?: SerialisedProject): ProjectEnvelope {
    if (data) return ProjectEnvelope.from(data);
    return this;
  }

  get name() { return this.initial.data.name; }

  get displayStatus() {
    const { data: { git, path } } = this.enrichedProject;
    const local = path ? 'Yes' : 'No';
    if (git === 'unknown') return { git: 'Unknown', local };
    if (git === 'none') return { git: 'No', local };
    return {
      git: `${git.totalStagedFiles || 'No'} staged files`,
      gitLatestCommitDate: getRelativeTimeStringNow(git.latestCommitDate),
      gitLastCheck: getRelativeTimeStringNow(git.lastCheck),
      local
    };
  }
  // updateData(data: Partial<z.infer<TCoreSchemas['rich']>>) {
  //   this.changes = reduceObjectChanges(this.data.current, {
  //     ...this.changes, ...data
  //   });
  //   return this;
  // }

  // audit() {
  //   // TODO: We want a list of objects from the audit log where we can see what the value changed FROM and TO.
  //   // This requires some thought because the keys must be found from the
  //   // previous entries.
  //   return this.envelope.audit.reduce((acc, { data, updated }) => {
  //     return acc;
  //   }, []);
  // }

  // serialise() {
  //   const updated = Temporal.Now.zonedDateTimeISO();
  //   // TODO: Cycle changes and put the existing values into the 
  //   // audit based on what changed. This is fine because the updated function
  //   // will handle applying the changes to the current state when we save.
  //   const audit = [{ data: this.changes, updated }, ...this.envelope.audit];
  //   return this.schema.codec.encode({
  //     ...this.envelope,
  //     audit, data: this.data.updated,
  //   });
  // }

  // get data(): {
  //   current: z.infer<TCoreSchemas['rich']>;
  //   updated: z.infer<TCoreSchemas['rich']>;
  // } {
  //   const current = this.envelope[
  //     'data' as keyof typeof this.envelope
  //   ] as z.infer<TCoreSchemas['rich']>;
  //   const updated = { ...current, ...this.changes };
  //   return { current, updated };
  // }
}
