import { forwardRef, PropsWithChildren, useCallback, useMemo } from "react";
import { Box, Button, List, ListItem, ListItemIcon, ListItemText, styled } from "@mui/material";
import { Check, HourglassTop } from "@mui/icons-material";
import { motion, AnimatePresence } from 'framer-motion';
import { Accordion } from "../../../shared/accordion";
import { Parenthesis } from "../../../shared/brackets";
import { JobSearchInteractionList } from "./InteractionList";
import { JobSearchApplicationList } from "./ApplicationList";
import { InteractionDetail } from "./InteractionDetail";
import { useSearchParams } from "react-router-dom";
import { JobSearchDbSchema } from "../../../../shared/features/job-search";
import { JobSearchPipeline } from "./Pipeline";
import { JobSearchUpdate } from "./Update";

const APPLICATION_SEARCH_PARAMETER = 'application';
const INTERACTION_SEARCH_PARAMETER = 'interaction';
const NEW_INTERACTION_SEARCH_PARAMETER = 'new-interaction';
const NEW_INTERACTION_SEARCH_PARAMETER_VALUE = 'true';

const Column = styled(motion.create(forwardRef<HTMLDivElement, PropsWithChildren>(({
  children,
  ...props
}: PropsWithChildren, ref) => {
  return <div ref={ref} {...props}>
    <motion.div layout>
      <Parenthesis roundness={8} />
    </motion.div>
    <div style={{ padding: 20 }}>
      {children}
    </div>
  </div>;
})))({
  display: 'flex',
  flexDirection: 'column',
  gap: '16px',
  height: '100%',
});

// Application list or micro-card Sort by:
// 1. Next interview date/time or test due date/time ascending.
// 2. Chase flag true -> false.
// 3. Most recent interaction date.

// Ideally have room for about 4 active "warm" applications at the top.
// Possibly the top one could be highlighted, and if nothing goes there, it advises to generate leads or something.

export const JobSearchDashboard = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const { applicationEditor, interactionCreator, interactionEditor } = useMemo(
    () => {
      const applicationEditor = searchParams.get(APPLICATION_SEARCH_PARAMETER) as JobSearchDbSchema['id']['applications'];
      const interactionCreator = searchParams.get(NEW_INTERACTION_SEARCH_PARAMETER) === NEW_INTERACTION_SEARCH_PARAMETER_VALUE;
      const interactionEditor = searchParams.get(INTERACTION_SEARCH_PARAMETER) as JobSearchDbSchema['id']['interactions'];
      return {
        applicationEditor,
        interactionCreator,
        interactionEditor
      };
    },
    [searchParams]
  );

  const handleApplicationEditMode = (id?: JobSearchDbSchema['id']['applications']) => {
    setSearchParams([[APPLICATION_SEARCH_PARAMETER, id || '']]);
  };
  const toggleInteractionCreator = useCallback(() => {
    // Toggle the value.
    const value = interactionCreator ? '' : NEW_INTERACTION_SEARCH_PARAMETER_VALUE;
    // if (interactionCreator) {
    //   // closeInteractionEditor();
    //   return;
    // }
    setSearchParams([[NEW_INTERACTION_SEARCH_PARAMETER, value]]);
  }, [searchParams, setSearchParams]);

  const handleInteractionEditMode = (id?: JobSearchDbSchema['id']['interactions']) => {
    setSearchParams([[INTERACTION_SEARCH_PARAMETER, id || '']]);
    // if (id) {
    //   return openInteractionEditor(id);
    // }
    // closeInteractionEditor();
  };

  const isEditing = useMemo(() => !!interactionEditor, [interactionEditor]);

  return <>
    <List sx={{ color: 'white', display: 'none' }}>
      <ListItem>
        <ListItemIcon><HourglassTop /></ListItemIcon>
        <ListItemText>A new lead arrives. This results in a new job application set to one of the "sourced" statuses. Probably this needs a job application detail view. It will create both a new application and an interaction.</ListItemText>
      </ListItem>
      <ListItem>
        <ListItemIcon><HourglassTop /></ListItemIcon>
        <ListItemText>An existing application has an update. Provide the update and it should ideally log an interaction.</ListItemText>
      </ListItem>
      <ListItem>
        <ListItemIcon><Check /></ListItemIcon>
        <ListItemText>An interaction needs correcting.</ListItemText>
      </ListItem>
      <ListItem>
        <ListItemIcon><HourglassTop /></ListItemIcon>
        <ListItemText>The left column should show a "feed". This can be from the interaction list, but should also show where they've "ghosted".</ListItemText>
      </ListItem>
    </List>
    <Accordion
      expanded={interactionCreator}
      onChange={toggleInteractionCreator}
      summary="Log Interaction"
    >
      <JobSearchUpdate />
    </Accordion>
    <Box sx={{ 
      display: 'flex', 
      // The gap only exists when we aren't in "Surgical/Full" mode
      gap: isEditing ? 0 : '24px', 
      width: '100%',
      transition: 'gap 0.5s ease',
      color: 'white',
    }}>
      
      {/* LEFT COLUMN: Remains mounted, transforms width */}
      <Column
        layout
        key="primary-column"
        style={{ 
          // If editing, take 100%. If not, take flex-basis 50%
          flex: isEditing ? '1 0 100%' : '1 0 calc(50% - 12px)' 
        }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
      >
        <AnimatePresence mode="wait">
          {interactionEditor ? (
            <motion.div
              key="editor-content"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ delay: 0.3 }} // Step 3: Fade in after expansion starts
            >
              <Button onClick={() => handleInteractionEditMode()}>Back to list</Button>
              <div style={{ display: 'flex' }}>
                <InteractionDetail interactionId={interactionEditor} />
                {/* <JobSearchInteractionList edit={handleInteractionEditMode}/> */}
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="list-content"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }} // Step 1: Fade out content
            >
              {/* <Button onClick={() => openInteractionEditor('fake interaction id')}>Open an interaction</Button> */}
              <JobSearchInteractionList edit={handleInteractionEditMode}/>
            </motion.div>
          )}
        </AnimatePresence>
      </Column>

      {/* RIGHT COLUMN: Unmounts and shrinks width to 0 */}
      <AnimatePresence>
        {!isEditing && (
          <Column
            key="secondary-column"
            initial={{ opacity: 0, width: 'calc(50% - 12px)' }}
            animate={{ opacity: 1, width: 'calc(50% - 12px)' }}
            exit={{ 
              opacity: 0, 
              width: 0, // Step 1: Shrink width to 0 to prevent "The Drop"
              transition: { duration: 0.4 } 
            }}
            style={{ flexShrink: 0 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
          >
            {/* <JobSearchApplicationList edit={handleApplicationEditMode} /> */}
            <JobSearchPipeline />
          </Column>
        )}
      </AnimatePresence>

    </Box>
  </>;
};
