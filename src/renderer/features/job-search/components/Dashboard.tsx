import { forwardRef, PropsWithChildren, useMemo } from "react";
import { Box, Button, List, ListItem, ListItemIcon, ListItemText, styled } from "@mui/material";
import { HourglassTop } from "@mui/icons-material";
import { motion, AnimatePresence } from 'framer-motion';
import { Accordion } from "../../../shared/accordion";
import { Parenthesis } from "../../../shared/brackets";
import { jobSearchDashboardLayoutStore } from "../stores";
import { InteractionCreation } from "./InteractionCreation";
import { JobSearchInteractionList } from "./InteractionList";

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

export const JobSearchDashboard = () => {
  const {
    interactionCreator,
    toggleInteractionCreator,
    interactionEditor,
    closeInteractionEditor,
    openInteractionEditor,
  } = jobSearchDashboardLayoutStore();

  const isEditing = useMemo(() => !!interactionEditor, [interactionEditor]);

  return <>
    Job Search Workflows
    <List sx={{ color: 'white' }}>
      <ListItem>
        <ListItemIcon><HourglassTop /></ListItemIcon>
        <ListItemText>A new lead arrives. This results in a new job application set to one of the "sourced" statuses. .</ListItemText>
      </ListItem>
      <ListItem>
        <ListItemIcon><HourglassTop /></ListItemIcon>
        <ListItemText>An existing application has an update. It might not result in a status change for the application.</ListItemText>
      </ListItem>
    </List>
    {/* <Accordion expanded={showInteractionCreation} onChange={() => setShowInteractionCreation(!showInteractionCreation)}> */}
    <Accordion
      expanded={interactionCreator}
      onChange={toggleInteractionCreator}
      summary="Log Interaction"
    >
      <InteractionCreation />
    </Accordion>
    CSS animation for opening:
    1. List fades out, right column fades out.
    2. List width increases, creation form shuts.
    3. Detail view fades in.
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
          {isEditing ? (
            <motion.div
              key="editor-content"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ delay: 0.3 }} // Step 3: Fade in after expansion starts
            >
              <Button onClick={closeInteractionEditor}>Back to list</Button>
              Editor component!
            </motion.div>
          ) : (
            <motion.div
              key="list-content"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }} // Step 1: Fade out content
            >
              <JobSearchInteractionList edit={openInteractionEditor}/>
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
            Application list
          </Column>
        )}
      </AnimatePresence>

    </Box>
  </>;
};
