// Cases:
// Update status.
// "draft" -> "committed"
// "committed" -> "processing"
// "processing" -> "processed", this will include the task ids, or other types
// of ids
// "processing" -> "rejected"
// Update things like the task ids.

// TODO: All committed items with a type of undefined id will be brought into a
// "queue" for processing. If no relevant ids are found, it will be put in as an
// empty array.
