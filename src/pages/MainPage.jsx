import React, { useState, useRef, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import './MainPage.css';

/**
 * Hovedkomponent for Todo-apperlikasjonen
 * 
 * Denne komponenten håndterer:
 * - Opprettelse og håndtering av oppgaver
 * - Kategorisering av oppgaver i seksjoner
 * - Dra-og-slipp funksjonalitet
 * - Lagring av data i localStorage
 */

// Standard konfigurasjon for seksjoner
const DEFAULT_SECTIONS_CONFIG = {
  'todo': { id: 'todo', title: 'Todo', tasks: [] }
};
const DEFAULT_SECTION_ORDER = ['todo'];

const PRIORITY_SECTIONS_CONFIG = {
  'backlog': { id: 'backlog', title: 'Backlog', tasks: [] },
  'todo': { id: 'todo', title: 'To Do', tasks: [] },
  'done': { id: 'done', title: 'Done', tasks: [] }
};
const PRIORITY_SECTION_ORDER = ['backlog', 'todo', 'done'];

// Base initial structure for the entire list state
const initialLists = {
  'personal': {
    id: 'personal',
    title: 'Todo List',
    priorityEnabled: false,
    sections: JSON.parse(JSON.stringify(DEFAULT_SECTIONS_CONFIG)),
    sectionOrder: [...DEFAULT_SECTION_ORDER]
  }
};

/**
 * Komponent for å vise en enkelt oppgave
 * 
 * @param {Object} props - Egenskaper for komponenten
 * @param {Object} props.task - Oppgaveobjektet som skal vises
 * @param {number} props.index - Indeksen til oppgaven i listen
 * @param {Function} props.onToggle - Funksjon som kalles når oppgaven merkes som fullført/ufullført
 * @param {Function} props.onUpdate - Funksjon for å oppdatere oppgavetekst
 * @param {Function} props.onDelete - Funksjon for å slette oppgaven
 * @param {Function} props.onTaskClick - Funksjon som kalles når oppgaven klikkes på
 * @param {Function} props.onMove - Funksjon for å flytte oppgaven til en annen seksjon
 * @param {boolean} props.priorityEnabled - Om prioritetsfunksjonalitet er aktivert
 * @param {string} props.currentSectionId - ID til gjeldende seksjon
 * @param {Array} props.sectionOptions - Liste over tilgjengelige seksjoner
 */
const TaskItem = ({ task, index, onToggle, onUpdate, onDelete, onTaskClick, onMove, priorityEnabled, currentSectionId, sectionOptions }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [text, setText] = useState(task.text);
  const inputRef = useRef(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  useEffect(() => {
    if (!isMenuOpen) return;

    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMenuOpen]);

  const handleBlur = () => {
    if (text.trim() !== '') {
      onUpdate(task.id, text);
    }
    setIsEditing(false);
  };

  const handleSaveEdit = () => {
    handleBlur(); // Re-uses existing blur logic which calls onUpdate and setIsEditing(false)
  };

  const handleCancelEdit = () => {
    setText(task.text); // Reset text to original
    setIsEditing(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleBlur();
    } else if (e.key === 'Escape') {
      setText(task.text);
      setIsEditing(false);
    }
  };

  return (
    <div 
      className={`task-item ${task.completed ? 'completed' : ''}`}
      onClick={(e) => {
        if (!isEditing) {
          onTaskClick(task);
        }
      }}
    >
      <div 
        className="task-checkbox"
        onClick={(e) => {
          e.stopPropagation();
          onToggle(task.id);
        }}
      >
        {task.completed && (
          <svg width="12" height="9" viewBox="0 0 12 9" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M1 4.5L4.33333 8L11 1" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        )}
      </div>
      {isEditing ? (
        <div className="edit-container">
          <input
            ref={inputRef}
            type="text"
            className="task-edit-input"
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={handleKeyDown}
            onClick={(e) => e.stopPropagation()}
          />
          <button className="save-edit-btn" onClick={handleSaveEdit} title="Save changes">
            <svg width="12" height="10" viewBox="0 0 12 10" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M1 5L4.33333 8.33333L11 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          <button className="cancel-edit-btn" onClick={handleCancelEdit} title="Cancel">
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M1 1L11 11M1 11L11 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>
      ) : (
        <div 
          className="task-text"
          onDoubleClick={() => setIsEditing(true)}
        >
          {task.text}
        </div>
      )}
      {!isEditing && (
        <div className="task-actions">
          <button onClick={(e) => { e.stopPropagation(); setIsEditing(true); }} className="edit-btn" title="Edit task">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M17.06 9.52998L14.47 6.93998L4.93997 16.47C4.75997 16.65 4.61997 16.97 4.55997 17.2L3.95997 20.04C3.87997 20.44 4.21997 20.78 4.61997 20.7L7.45997 20.1C7.69997 20.04 8.01997 19.9 8.19997 19.72L17.06 10.86C17.44 10.48 17.44 9.90998 17.06 9.52998Z" stroke="currentColor" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/><path d="M13.66 7.75002L16.25 10.34" stroke="currentColor" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </button>
          <button onClick={(e) => { e.stopPropagation(); onDelete(task.id); }} className="delete-btn" title="Delete task">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M19.5 5.5L18.88 18.22C18.74 19.71 17.49 20.82 15.99 20.82H8.01C6.51 20.82 5.26 19.71 5.12 18.22L4.5 5.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/><path d="M3 5.5H21" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/><path d="M14.5 5.5V4.25C14.5 3.28 13.72 2.5 12.75 2.5H11.25C10.28 2.5 9.5 3.28 9.5 4.25V5.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </button>
          {priorityEnabled && (
            <button 
              className="task-menu-trigger-btn" 
              onClick={(e) => { 
                e.stopPropagation(); 
                setIsMenuOpen(prev => !prev); 
              }}
              title="Task options"
            >
              <svg className="task-menu-icon" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 8C13.1 8 14 7.1 14 6C14 4.9 13.1 4 12 4C10.9 4 10 4.9 10 6C10 7.1 10.9 8 12 8ZM12 10C10.9 10 10 10.9 10 12C10 13.1 10.9 14 12 14C13.1 14 14 13.1 14 12C14 10.9 13.1 10 12 10ZM12 16C10.9 16 10 16.9 10 18C10 19.1 10.9 20 12 20C13.1 20 14 19.1 14 18C14 16.9 13.1 16 12 16Z"/>
              </svg>
            </button>
          )}
        </div>
      )}
      {isMenuOpen && priorityEnabled && (
        <div className="task-dropdown-menu" ref={menuRef}>
          {(sectionOptions || [])
            .filter(option => option.id !== currentSectionId)
            .map(option => (
              <div
                key={option.id}
                className="task-dropdown-menu-item"
                onClick={(e) => {
                  e.stopPropagation();
                  onMove(option.id);
                  setIsMenuOpen(false);
                }}
              >
                Move to {option.title}
              </div>
            ))}
        </div>
      )}
    </div>
  );
};

/**
 * Komponent for en seksjon med oppgaver
 * 
 * @param {Object} props - Egenskaper for komponenten
 * @param {Object} props.section - Seksjonsobjektet
 * @param {Array} props.tasks - Liste over oppgaver i seksjonen
 * @param {Function} props.onTaskToggle - Funksjon for å bytte status på oppgave
 * @param {Function} props.onTaskUpdate - Funksjon for å oppdatere oppgave
 * @param {Function} props.onTaskDelete - Funksjon for å slette oppgave
 * @param {Function} props.onTaskClick - Funksjon som kalles når en oppgave klikkes på
 * @param {Function} props.onDragEnd - Funksjon som kalles ved dra-og-slipp
 * @param {Function} props.onStartEditTitle - Funksjon for å starte redigering av seksjonstittel
 * @param {Function} props.onSaveEditTitle - Funksjon for å lagre ny seksjonstittel
 * @param {Function} props.onCancelEditTitle - Funksjon for å avbryte redigering av seksjonstittel
 * @param {string} props.editingSectionId - ID til seksjonen som redigeres
 * @param {string} props.editingSectionTitleText - Midlertidig tekst under redigering
 * @param {Object} props.sectionInputRef - React ref for input-feltet
 * @param {Function} props.onAddNewTask - Funksjon for å legge til ny oppgave
 * @param {Function} props.onTaskMove - Funksjon for å flytte oppgave til annen seksjon
 * @param {boolean} props.priorityEnabled - Om prioritetsfunksjonalitet er aktivert
 * @param {Array} props.sectionOptions - Liste over tilgjengelige seksjoner
 */
const Section = ({ section, tasks, onTaskToggle, onTaskUpdate, onTaskDelete, onTaskClick, onDragEnd, onStartEditTitle, onSaveEditTitle, onCancelEditTitle, editingSectionId, editingSectionTitleText, sectionInputRef, onAddNewTask, onTaskMove, priorityEnabled, sectionOptions }) => {
  return (
    <div className="section">
      <h3 className="section-title">{section.title}</h3>
      <div className="section-divider"></div>
      <Droppable droppableId={section.id} type="task">
        {(provided) => (
          <div 
            className="task-list"
            ref={provided.innerRef}
            {...provided.droppableProps}
          >
            {tasks.map((task, index) => (
              <Draggable key={task.id} draggableId={task.id} index={index}>
                {(provided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                  >
                    <TaskItem
                      key={task.id}
                      task={task}
                      index={index}
                      onToggle={onTaskToggle}
                      onUpdate={onTaskUpdate}
                      onDelete={onTaskDelete}
                      onTaskClick={onTaskClick}
                      onMove={(destinationSectionId) => onTaskMove(task.id, destinationSectionId)}
                      priorityEnabled={priorityEnabled}
                      currentSectionId={section.id}
                      sectionOptions={sectionOptions}
                    />
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </div>
  );
};

/**
 * Hovedkomponent for todo-listen
 * 
 * Håndterer:
 * - Tilstand for lister og oppgaver
 * - Lagring og lasting fra localStorage
 * - Håndtering av brukerinteraksjoner
 * - Visning av modaler og redigeringsmoduser
 */
const MainPage = () => {
  // Funksjon for å laste lister fra localStorage med detaljert logging
  const loadLists = () => {
    console.log('=== STARTER LASTING AV LAGREDE LISTER ===');
    console.log('Tid:', new Date().toISOString());
    
    try {
      // Prøv å hente lagret data
      const saved = localStorage.getItem('todoLists');
      console.log('1. Hentet fra localStorage:', saved ? 'Data funnet' : 'Ingen data funnet');
      
      if (!saved) {
        console.log('2. Ingen lagrede lister funnet, bruker standard konfigurasjon.');
        return JSON.parse(JSON.stringify(initialLists));
      }
      
      // Prøv å parse JSON
      let parsed;
      try {
        parsed = JSON.parse(saved);
        console.log('3. JSON parset OK');
      } catch (parseError) {
        console.error('3. FEIL ved parsing av JSON:', parseError);
        throw new Error('Ugyldig JSON');
      }
      
      // Logg strukturen på de lagrede dataene
      console.log('4. Struktur på lagrede data:', {
        hasPersonal: !!parsed.personal,
        hasSections: !!(parsed.personal && parsed.personal.sections),
        hasSectionOrder: Array.isArray(parsed.personal?.sectionOrder),
        sectionCount: parsed.personal?.sectionOrder?.length || 0
      });
      
      // Sjekk om dataen har grunnleggende struktur
      if (!parsed || !parsed.personal || !parsed.personal.sections || !Array.isArray(parsed.personal.sectionOrder)) {
        console.warn('5. Ugyldig datastruktur, bruker standard konfigurasjon.');
        return JSON.parse(JSON.stringify(initialLists));
      }
      
      // Logg alle seksjons-IDer og titler
      console.log('6. Seksjoner funnet i lagret data:');
      if (Array.isArray(parsed.personal.sectionOrder)) {
        parsed.personal.sectionOrder.forEach((sectionId, index) => {
          const section = parsed.personal.sections[sectionId];
          console.log(`   ${index + 1}. ID: ${sectionId}, Tittel: ${section?.title || 'Mangler tittel'}, Oppgaver: ${section?.tasks?.length || 0}`);
        });
      }
      
      // Bygg et nytt objekt med bare det vi trenger
      const result = {
        personal: {
          id: 'personal',
          title: parsed.personal.title || 'Todo List',
          priorityEnabled: !!parsed.personal.priorityEnabled,
          sections: {},
          sectionOrder: []
        }
      };
      
      console.log('7. Behandler seksjoner...');
      let processedSections = 0;
      let processedTasks = 0;
      
      // Legg til seksjoner fra sectionOrder hvis de finnes i sections
      if (Array.isArray(parsed.personal.sectionOrder)) {
        parsed.personal.sectionOrder.forEach(sectionId => {
          const section = parsed.personal.sections[sectionId];
          if (section && typeof section === 'object') {
            const taskCount = Array.isArray(section.tasks) ? section.tasks.length : 0;
            console.log(`   Behandler seksjon: "${section.title || 'Uten tittel'}" (${taskCount} oppgaver)`);
            
            result.personal.sections[sectionId] = {
              id: section.id || sectionId,
              title: section.title || 'Uten tittel',
              tasks: Array.isArray(section.tasks) 
                ? section.tasks
                    .filter(t => t && typeof t === 'object')
                    .map(t => ({
                      id: t.id || generateId('task'),
                      text: t.text || '',
                      description: t.description || '',
                      completed: !!t.completed
                    }))
                : []
            };
            result.personal.sectionOrder.push(sectionId);
            
            processedSections++;
            processedTasks += taskCount;
          }
        });
      }
      
      console.log(`8. Ferdig med lasting. Laster ${processedSections} seksjoner med totalt ${processedTasks} oppgaver.`);
      console.log('=== FERDIG MED LASTING AV LAGREDE LISTER ===\n');
      
      return result;
      
    } catch (error) {
      console.error('FEIL under lasting av lister:', {
        error: error.message,
        stack: error.stack
      });
      console.log('Bruker standard konfigurasjon pga. feil under lasting.\n');
      return JSON.parse(JSON.stringify(initialLists));
    }
  };
  
  // Initialiser state med lister fra localStorage
  const [lists, setLists] = useState(loadLists);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isAddingList, setIsAddingList] = useState(false);
  const [newListName, setNewListName] = useState('');
  const [inputValue, setInputValue] = useState('');
  const [activeSection, setActiveSection] = useState(() => {
    // Initialize with default; useEffect will sync with loaded 'lists' state.
    return initialLists.personal.sectionOrder[0];
  });
  const [selectedTask, setSelectedTask] = useState(null);
  const [description, setDescription] = useState('');
  const inputRef = useRef(null);
  const newListInputRef = useRef(null);
  const sectionInputRef = useRef(null); // Ref for section title edit input

  const [editingSectionId, setEditingSectionId] = useState(null);
  const [editingSectionTitleText, setEditingSectionTitleText] = useState('');

  const currentList = lists['personal'] || JSON.parse(JSON.stringify(initialLists.personal));
  const sections = (currentList.sectionOrder || []).map(sectionId => ({
    ...(currentList.sections[sectionId] || { id: sectionId, title: sectionId, tasks: [] }),
    ...currentList.sections[sectionId],
    id: sectionId
  }));

  useEffect(() => {
    if (isExpanded && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isExpanded]);

  useEffect(() => {
    // Sync activeSection if the loaded lists have a different structure or activeSection is invalid
    const personalList = lists.personal;
    if (personalList && personalList.sections && personalList.sectionOrder) {
      if (!personalList.sections[activeSection] && personalList.sectionOrder.length > 0) {
        setActiveSection(personalList.sectionOrder[0]);
      }
    }    
  }, [lists, activeSection]);

  useEffect(() => {
    if (editingSectionId && sectionInputRef.current) {
      sectionInputRef.current.focus();
      sectionInputRef.current.select();
    }
  }, [editingSectionId]);

  // Lagrer lister til localStorage når de endres
  useEffect(() => {
    console.log('\n=== STARTER LAGRING TIL LOCALSTORAGE ===');
    console.log('Tid:', new Date().toISOString());
    
    // Logg hvilke lister som skal lagres
    console.log('1. Skal lagre følgende lister:');
    console.log({
      antallSeksjoner: lists.personal.sectionOrder?.length || 0,
      seksjoner: lists.personal.sectionOrder || [],
      tittel: lists.personal.title || 'Ingen tittel',
      prioritetAktivert: !!lists.personal.priorityEnabled
    });
    
    // Logg detaljer om hver seksjon
    if (lists.personal.sectionOrder && Array.isArray(lists.personal.sectionOrder)) {
      console.log('2. Detaljer om seksjoner:');
      lists.personal.sectionOrder.forEach((sectionId, index) => {
        const section = lists.personal.sections[sectionId];
        if (section) {
          console.log(`   ${index + 1}. ${section.title || 'Uten tittel'} (${section.id})`);
          console.log(`      Oppgaver: ${section.tasks?.length || 0} stk`);
          
          // Vis de første 3 oppgavene for hver seksjon for debugging
          if (section.tasks && section.tasks.length > 0) {
            console.log('      Eksempeloppgaver:');
            section.tasks.slice(0, 3).forEach((task, taskIndex) => {
              console.log(`      - ${taskIndex + 1}. ${task.text || 'Ingen tekst'} (${task.completed ? 'fullført' : 'ikke fullført'})`);
            });
            if (section.tasks.length > 3) {
              console.log(`      ...og ${section.tasks.length - 3} flere`);
            }
          }
        } else {
          console.warn(`   ${index + 1}. Manglende seksjon med ID: ${sectionId}`);
        }
      });
    }
    
    // Lag en ren kopi av dataen vi vil lagre
    const dataToSave = {
      personal: {
        id: 'personal',
        title: lists.personal.title || 'Todo List',
        priorityEnabled: !!lists.personal.priorityEnabled,
        sections: {},
        sectionOrder: Array.isArray(lists.personal.sectionOrder) 
          ? [...lists.personal.sectionOrder] 
          : []
      }
    };
    
    // Kopier seksjonene
    if (lists.personal.sections && typeof lists.personal.sections === 'object') {
      console.log('3. Kopierer seksjoner...');
      let sectionsCopied = 0;
      let tasksCopied = 0;
      
      Object.entries(lists.personal.sections).forEach(([sectionId, section]) => {
        if (section && typeof section === 'object') {
          const taskCount = Array.isArray(section.tasks) ? section.tasks.length : 0;
          console.log(`   Kopierer seksjon: "${section.title || 'Uten tittel'}" (${taskCount} oppgaver)`);
          
          dataToSave.personal.sections[sectionId] = {
            id: section.id || sectionId,
            title: section.title || 'Uten tittel',
            tasks: Array.isArray(section.tasks) 
              ? section.tasks
                  .filter(t => t && typeof t === 'object')
                  .map(t => ({
                    id: t.id || generateId('task'),
                    text: t.text || '',
                    description: t.description || '',
                    completed: !!t.completed
                  }))
              : []
          };
          
          sectionsCopied++;
          tasksCopied += taskCount;
        }
      });
      
      console.log(`   Ferdig med kopiering: ${sectionsCopied} seksjoner med totalt ${tasksCopied} oppgaver`);
    }
    
    // Lagre til localStorage
    try {
      console.log('4. Lagrer til localStorage...');
      const dataString = JSON.stringify(dataToSave);
      
      // Logg størrelsen på dataene som skal lagres
      const dataSize = new TextEncoder().encode(dataString).length;
      const maxSize = 5 * 1024 * 1024; // 5MB, typisk grense for localStorage
      console.log(`   Størrelse på data: ${(dataSize / 1024).toFixed(2)} KB`);
      console.log(`   Tilgjengelig plass: ${(maxSize / 1024 / 1024).toFixed(2)} MB`);
      
      if (dataSize > maxSize * 0.9) {
        console.warn('   ADVARSEL: Nærmer seg lagringsgrense!');
      }
      
      // Utfør selve lagringen
      localStorage.setItem('todoLists', dataString);
      console.log('5. Lagring fullført');
      
      // Verifiser at dataen ble lagret
      setTimeout(() => {
        console.log('6. Verifiserer lagring...');
        const savedData = localStorage.getItem('todoLists');
        
        if (savedData === dataString) {
          console.log('   Verifisert: Dataene ble lagret korrekt');
        } else if (savedData) {
          console.warn('   ADVARSEL: Lagret data ser ikke ut til å matche forventet verdi');
          console.log('   Forventet lengde:', dataString.length);
          console.log('   Faktisk lengde:', savedData.length);
        } else {
          console.error('   FEIL: Kunne ikke hente lagret data');
        }
        
        console.log('=== FERDIG MED LAGRING TIL LOCALSTORAGE ===\n');
      }, 100);
      
    } catch (error) {
      console.error('FEIL under lagring til localStorage:', {
        error: error.message,
        stack: error.stack
      });
      
      // Prøv å lagre en mindre mengde data for å se om det hjelper
      try {
        console.log('Prøver å lagre en forenklet versjon...');
        const minimalData = {
          personal: {
            id: 'personal',
            title: lists.personal.title || 'Todo List',
            priorityEnabled: false,
            sections: {},
            sectionOrder: []
          }
        };
        localStorage.setItem('todoLists', JSON.stringify(minimalData));
        console.log('Kunne lagre en tom versjon, noe er galt med dataene våre');
      } catch (innerError) {
        console.error('Kunne ikke lagre engang en tom versjon:', innerError.message);
      }
      
      console.log('=== FEIL UNDER LAGRING TIL LOCALSTORAGE ===\n');
    }
    
  }, [lists]);


  const handleStartEditSectionTitle = (sectionId, currentTitle) => {
    setEditingSectionId(sectionId);
    setEditingSectionTitleText(currentTitle);
  };

  const handleCancelEditSectionTitle = () => {
    setEditingSectionId(null);
    setEditingSectionTitleText('');
  };

  const handleSaveSectionTitle = () => {
    if (editingSectionId && editingSectionTitleText.trim() !== '') {
      setLists(prevLists => {
        const newLists = JSON.parse(JSON.stringify(prevLists)); // Deep clone
        if (newLists.personal && newLists.personal.sections[editingSectionId]) {
          newLists.personal.sections[editingSectionId].title = editingSectionTitleText.trim();
        }
        return newLists;
      });
    }
    handleCancelEditSectionTitle(); // Reset editing state
  };

  const handleSectionTitleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSaveSectionTitle();
    } else if (e.key === 'Escape') {
      handleCancelEditSectionTitle();
    }
  };

  const handleDeleteSection = (sectionIdToDelete) => {
    // Optional: Add a confirmation dialog here
    // if (!window.confirm(`Are you sure you want to delete the list "${lists.personal.sections[sectionIdToDelete]?.title}"?`)) {
    //   return;
    // }

    setLists(prevLists => {
      const newLists = JSON.parse(JSON.stringify(prevLists));
      if (newLists.personal && newLists.personal.sections[sectionIdToDelete]) {
        delete newLists.personal.sections[sectionIdToDelete];
        newLists.personal.sectionOrder = newLists.personal.sectionOrder.filter(id => id !== sectionIdToDelete);

        // If the deleted section was the active one, update activeSection
        if (activeSection === sectionIdToDelete) {
          if (newLists.personal.sectionOrder.length > 0) {
            setActiveSection(newLists.personal.sectionOrder[0]);
          } else {
            // No sections left, potentially create a default one or set to null
            // For now, let's try to add a default 'todo' section if none exist
            const defaultSectionId = 'todo';
            const defaultSectionTitle = 'Todo';
            if (!newLists.personal.sections[defaultSectionId]) {
                newLists.personal.sections[defaultSectionId] = { id: defaultSectionId, title: defaultSectionTitle, tasks: [] };
                newLists.personal.sectionOrder.push(defaultSectionId);
                setActiveSection(defaultSectionId);
            } else {
                setActiveSection(null); // Or handle as preferred
            }
          }
        }
      }
      return newLists;
    });
    // If a section was being edited and it's the one deleted, cancel edit mode
    if (editingSectionId === sectionIdToDelete) {
        handleCancelEditSectionTitle();
    }
  };

  const handleButtonClick = () => {
    if (!isExpanded) {
      setIsExpanded(true);
    } else if (inputValue.trim() !== '') {
      const newTask = {
        id: generateId('task'),
        text: inputValue.trim(),
        description: '',
        completed: false
      };
      
      setLists(prev => {
        const updatedLists = {
          ...prev,
          personal: {
            ...prev.personal,
            sections: {
              ...prev.personal.sections,
              [activeSection]: {
                ...prev.personal.sections[activeSection],
                tasks: [...prev.personal.sections[activeSection].tasks, newTask]
              }
            }
          }
        };
        
        // Lagre til localStorage direkte for å unngå forsinkelse
        try {
          localStorage.setItem('todoLists', JSON.stringify(updatedLists));
        } catch (error) {
          console.error('Kunne ikke lagre til localStorage:', error);
        }
        
        return updatedLists;
      });
      
      setInputValue('');
      setIsExpanded(false);
    } else {
      // Handle close when clicking the button while expanded but input is empty
      setInputValue('');
      setIsExpanded(false);
    }
  };

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && inputValue.trim() !== '') {
      handleButtonClick();
    } else if (e.key === 'Escape') {
      setInputValue('');
      setIsExpanded(false);
    }
  };

  /**
   * Bygger status på en oppgave mellom fullført og ufullført
   * @param {string} taskId - ID til oppgaven som skal endres
   */
  const handleTaskToggle = (taskId) => {
    setLists(prev => {
      const updatedSections = { ...prev.personal.sections };
      Object.keys(updatedSections).forEach(sectionId => {
        const taskIndex = updatedSections[sectionId].tasks.findIndex(t => t.id === taskId);
        if (taskIndex !== -1) {
          updatedSections[sectionId] = {
            ...updatedSections[sectionId],
            tasks: updatedSections[sectionId].tasks.map((t, i) => 
              i === taskIndex ? { ...t, completed: !t.completed } : t
            )
          };
        }
      });
      
      return {
        ...prev,
        personal: {
          ...prev.personal,
          sections: updatedSections
        }
      };
    });
  };

  /**
   * Oppdaterer tekst og beskrivelse for en oppgave
   * @param {string} taskId - ID til oppgaven som skal oppdateres
   * @param {string} newText - Ny tekst for oppgaven
   * @param {string} [newDescription] - Ny beskrivelse for oppgaven (valgfri)
   */
  const handleTaskUpdate = (taskId, newText, newDescription) => {
    if (newText.trim() === '') return;
    
    setLists(prev => {
      const updatedSections = { ...prev.personal.sections };
      Object.keys(updatedSections).forEach(sectionId => {
        const taskIndex = updatedSections[sectionId].tasks.findIndex(t => t.id === taskId);
        if (taskIndex !== -1) {
          updatedSections[sectionId] = {
            ...updatedSections[sectionId],
            tasks: updatedSections[sectionId].tasks.map((t, i) => 
              i === taskIndex ? { 
                ...t, 
                text: newText,
                description: newDescription !== undefined ? newDescription : (t.description || '') 
              } : t
            )
          };
        }
      });
      
      return {
        ...prev,
        personal: {
          ...prev.personal,
          sections: updatedSections
        }
      };
    });
  };

  /**
   * Sletter en oppgave fra alle seksjoner
   * @param {string} taskId - ID til oppgaven som skal slettes
   */
  const handleTaskDelete = (taskId) => {
    setLists(prev => {
      const updatedSections = { ...prev.personal.sections };
      Object.keys(updatedSections).forEach(sectionId => {
        // Ensure tasks array exists before filtering
        if (updatedSections[sectionId] && updatedSections[sectionId].tasks) {
          updatedSections[sectionId] = {
            ...updatedSections[sectionId],
            tasks: updatedSections[sectionId].tasks.filter(t => t.id !== taskId)
          };
        }
      });
      
      return {
        ...prev,
        personal: {
          ...prev.personal,
          sections: updatedSections
        }
      };
    });
  };

  /**
   * Håndterer slutten av en dra-og-slipp operasjon
   * @param {Object} result - Informasjon om dra-og-slipp operasjonen
   * @param {Object} result.source - Kilde for dra-operasjonen
   * @param {Object} result.destination - Destinasjon for dra-operasjonen
   * @param {string} result.draggableId - ID til elementet som ble dratt
   * @param {string} result.type - Type element som ble dratt
   */
  const onDragEnd = (result) => {
    const { source, destination, draggableId, type } = result;

    if (!destination) return;
    if (source.droppableId === destination.droppableId && source.index === destination.index) return;

    if (type === 'task') {
      const sourceSection = source.droppableId;
      const destSection = destination.droppableId;
      
      setLists(prev => {
        const sections = { ...prev.personal.sections };
        const sourceTasks = [...sections[sourceSection].tasks];
        const [removed] = sourceTasks.splice(source.index, 1);
        
        if (sourceSection === destSection) {
          sourceTasks.splice(destination.index, 0, removed);
          
          return {
            ...prev,
            personal: {
              ...prev.personal,
              sections: {
                ...sections,
                [sourceSection]: {
                  ...sections[sourceSection],
                  tasks: sourceTasks
                }
              }
            }
          };
        } else {
          const destTasks = [...sections[destSection].tasks];
          destTasks.splice(destination.index, 0, removed);
          
          return {
            ...prev,
            personal: {
              ...prev.personal,
              sections: {
                ...sections,
                [sourceSection]: {
                  ...sections[sourceSection],
                  tasks: sourceTasks
                },
                [destSection]: {
                  ...sections[destSection],
                  tasks: destTasks
                }
              }
            }
          };
        }
      });
    }
  };

  const handleNewListKeyDown = (e) => {
    if (e.key === 'Enter' && newListName.trim() !== '') {
      handleAddList();
    } else if (e.key === 'Escape') {
      setIsAddingList(false);
      setNewListName('');
    }
  };

  /**
   * Genererer en unik ID for nye seksjoner
   */
  const generateId = (prefix = 'section') => {
    return `${prefix}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  };

  /**
   * Legger til en ny seksjon/undermappe
   */
  const handleAddList = () => {
    if (newListName.trim() === '') return;
    
    const newSectionId = generateId('section');
    const newSection = {
      id: newSectionId,
      title: newListName.trim(),
      tasks: []
    };
    
    setLists(prev => {
      const updatedLists = {
        ...prev,
        personal: {
          ...prev.personal,
          sections: {
            ...prev.personal.sections,
            [newSectionId]: newSection
          },
          sectionOrder: [...prev.personal.sectionOrder, newSectionId]
        }
      };
      
      // Lagre til localStorage direkte for å unngå forsinkelse
      try {
        localStorage.setItem('todoLists', JSON.stringify(updatedLists));
      } catch (error) {
        console.error('Kunne ikke lagre til localStorage:', error);
      }
      
      return updatedLists;
    });
    
    setActiveSection(newSectionId);
    setIsAddingList(false);
    setNewListName('');
  };

  const handleTaskClick = (task) => {
    setSelectedTask(task);
    setDescription(task.description || '');
  };

  /**
   * Lagrer beskrivelsen for den valgte oppgaven
   */
  const handleSaveDescription = () => {
    if (selectedTask) {
      handleTaskUpdate(selectedTask.id, selectedTask.text, description);
      setSelectedTask(null);
    }
  };

  /**
   * Lukker beskrivelsesmodalen uten å lagre endringer
   */
  const handleCloseDescription = () => {
    setSelectedTask(null);
  };

  return (
    <div className="main-page">
      {selectedTask && (
        <div className="description-modal-overlay" onClick={handleCloseDescription}>
          <div className="description-modal" onClick={e => e.stopPropagation()}>
            <h3>Description</h3>
            <textarea
              className="description-textarea"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              onClick={e => e.stopPropagation()}
              placeholder="Add a more detailed description..."
            />
            <div className="description-actions">
              <button className="save-description-btn" onClick={handleSaveDescription}>
                Save
              </button>
              <button className="cancel-description-btn" onClick={handleCloseDescription}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
      <div className="centered-box">
        <div className="content-container">
          <div className="left-space">
            <div className="sidebar">
              <h2 className="list-title">{currentList?.title}</h2>
              <div className="section-tabs">
                {sections.map(section => (
                  <div key={section.id} className={`section-tab-item-container ${activeSection === section.id ? 'active' : ''}`}>
                    {editingSectionId === section.id ? (
                      <div className="edit-section-container">
                        <input
                          ref={sectionInputRef}
                          type="text"
                          className="section-title-edit-input"
                          value={editingSectionTitleText}
                          onChange={(e) => setEditingSectionTitleText(e.target.value)}
                          onKeyDown={handleSectionTitleKeyDown}
                          onBlur={() => setTimeout(handleSaveSectionTitle, 0)} // Use timeout to allow button clicks
                          onClick={(e) => e.stopPropagation()} // Prevent tab click
                        />
                        <button 
                          className="save-section-btn section-action-btn"
                          onClick={(e) => { e.stopPropagation(); handleSaveSectionTitle(); }}
                          title="Save title"
                        >
                          <svg width="12" height="10" viewBox="0 0 12 10" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M1 5L4.33333 8.33333L11 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                        </button>
                        <button 
                          className="cancel-section-btn section-action-btn"
                          onClick={(e) => { e.stopPropagation(); handleCancelEditSectionTitle(); }}
                          title="Cancel edit"
                        >
                          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M1 1L11 11M1 11L11 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                        </button>
                      </div>
                    ) : (
                      <button
                        className={`section-tab ${activeSection === section.id ? 'active' : ''}`}
                        onClick={() => setActiveSection(section.id)}
                        onDoubleClick={() => handleStartEditSectionTitle(section.id, section.title)}
                      >
                        <span className="section-tab-title">{section.title}</span>
                        <div className="section-tab-actions">
                          <button 
                            onClick={(e) => { e.stopPropagation(); handleStartEditSectionTitle(section.id, section.title); }}
                            className="edit-section-btn section-action-btn"
                            title="Edit list name"
                          >
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M17.06 9.52998L14.47 6.93998L4.93997 16.47C4.75997 16.65 4.61997 16.97 4.55997 17.2L3.95997 20.04C3.87997 20.44 4.21997 20.78 4.61997 20.7L7.45997 20.1C7.69997 20.04 8.01997 19.9 8.19997 19.72L17.06 10.86C17.44 10.48 17.44 9.90998 17.06 9.52998Z" stroke="currentColor" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/><path d="M13.66 7.75002L16.25 10.34" stroke="currentColor" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/></svg>
                          </button>
                          <button 
                            onClick={(e) => { e.stopPropagation(); handleDeleteSection(section.id); }}
                            className="delete-section-btn section-action-btn"
                            title="Delete list"
                          >
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M19.5 5.5L18.88 18.22C18.74 19.71 17.49 20.82 15.99 20.82H8.01C6.51 20.82 5.26 19.71 5.12 18.22L4.5 5.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/><path d="M3 5.5H21" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/><path d="M14.5 5.5V4.25C14.5 3.28 13.72 2.5 12.75 2.5H11.25C10.28 2.5 9.5 3.28 9.5 4.25V5.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                          </button>
                        </div>
                      </button>
                    )}
                  </div>
                ))}
                {isAddingList ? (
                  <div className="new-list-input-container">
                    <input
                      ref={newListInputRef}
                      type="text"
                      className="new-list-input"
                      value={newListName}
                      onChange={(e) => setNewListName(e.target.value)}
                      onKeyDown={handleNewListKeyDown}
                      onBlur={() => setTimeout(handleAddList,0)} // Use timeout to allow button clicks if any
                      placeholder="New list name..."
                    />
                     <button 
                        className="save-section-btn section-action-btn"
                        onClick={(e) => { e.stopPropagation(); handleAddList(); }}
                        title="Save list"
                      >
                        <svg width="12" height="10" viewBox="0 0 12 10" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M1 5L4.33333 8.33333L11 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                      </button>
                      <button 
                        className="cancel-section-btn section-action-btn"
                        onClick={(e) => { e.stopPropagation(); setIsAddingList(false); setNewListName(''); }}
                        title="Cancel add list"
                      >
                        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M1 1L11 11M1 11L11 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                      </button>
                  </div>
                ) : (
                  <button 
                    className="add-list-button"
                    onClick={() => setIsAddingList(true)}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 5V19M5 12H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    New List
                  </button>
                )}
              </div>
            </div>
          </div>
              <div className="white-box">
                <DragDropContext onDragEnd={onDragEnd}>
                  <div className="sections-container">
                    {currentList.sections[activeSection] ? (
                      <Section
                        key={activeSection}
                        section={currentList.sections[activeSection]}
                        tasks={currentList.sections[activeSection].tasks || []}
                        onTaskToggle={handleTaskToggle}
                        onTaskUpdate={handleTaskUpdate}
                        onTaskDelete={handleTaskDelete}
                        onTaskClick={handleTaskClick}
                        onDragEnd={onDragEnd}
                      />
                    ) : (
                      <div className="empty-state">
                        <p>No section selected. Select or create a list to get started!</p>
                      </div>
                    )}
                  </div>
                </DragDropContext>
                
                <div className="add-task-container">
                  <button 
                    className={`add-button ${isExpanded ? 'expanded' : ''}`}
                    onClick={handleButtonClick}
                    aria-label={isExpanded ? 'Collapse' : 'Add new item'}
                  >
                    <div className="button-content">
                      {isExpanded && (
                        <input
                          ref={inputRef}
                          type="text"
                          className="search-input"
                          value={inputValue}
                          onChange={handleInputChange}
                          onKeyDown={handleKeyDown}
                          placeholder="New task..."
                          aria-label="New task input"
                        />
                      )}
                      <svg 
                        className={`icon ${inputValue.trim() ? 'arrow-icon' : 'plus-icon'}`} 
                        viewBox="0 0 24 24" 
                        fill="none" 
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        {inputValue.trim() ? (
                          <path d="M5 12H19M12 5l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        ) : (
                          <path d="M12 5V19M5 12H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        )}
                      </svg>
                    </div>
                  </button>
                </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainPage;
