import React, { useState, useRef, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import './MainPage.css';

// Sample data structure
const initialLists = {
  'personal': {
    id: 'personal',
    title: 'Todo List',
    sections: {
      'todo': {
        id: 'todo',
        title: 'todo',
        tasks: []
      }
    },
    sectionOrder: ['todo']
  }
};

const TaskItem = ({ task, index, onToggle, onUpdate, onDelete }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [text, setText] = useState(task.text);
  const inputRef = useRef(null);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

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
      onClick={() => !isEditing && onToggle(task.id)}
    >
      <div className="task-checkbox">
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
        </div>
      )}
    </div>
  );
};

const Section = ({ section, tasks, onTaskToggle, onTaskUpdate, onTaskDelete, onDragEnd }) => {
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
                      task={task}
                      index={index}
                      onToggle={onTaskToggle}
                      onUpdate={onTaskUpdate}
                      onDelete={onTaskDelete}
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

const MainPage = () => {
  const [lists, setLists] = useState(() => {
    const savedLists = localStorage.getItem('todoLists');
    if (savedLists) {
      const parsedLists = JSON.parse(savedLists);
      // Ensure the title is set to 'Todo List' even when loading from localStorage
      if (parsedLists.personal && parsedLists.personal.title !== 'Todo List') {
        parsedLists.personal.title = 'Todo List';
      }
      console.log('Loading lists from localStorage:', parsedLists);
      return parsedLists;
    }
    console.log('Initializing with default lists:', initialLists);
    return JSON.parse(JSON.stringify(initialLists)); // Deep clone to prevent reference issues
  });
  const [isExpanded, setIsExpanded] = useState(false);
  const [isAddingList, setIsAddingList] = useState(false);
  const [newListName, setNewListName] = useState('');
  const [inputValue, setInputValue] = useState('');
  const [activeSection, setActiveSection] = useState(initialLists.personal.sectionOrder[0]);
  const inputRef = useRef(null);
  const newListInputRef = useRef(null);
  const sectionInputRef = useRef(null); // Ref for section title edit input

  const [editingSectionId, setEditingSectionId] = useState(null);
  const [editingSectionTitleText, setEditingSectionTitleText] = useState('');

  const currentList = lists['personal'] || { sections: {}, sectionOrder: [] };
  const sections = currentList.sectionOrder.map(sectionId => ({
    ...currentList.sections[sectionId],
    id: sectionId
  }));

  useEffect(() => {
    if (isExpanded && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isExpanded]);

  useEffect(() => {
    if (editingSectionId && sectionInputRef.current) {
      sectionInputRef.current.focus();
      sectionInputRef.current.select();
    }
  }, [editingSectionId]);

  // Save lists to localStorage whenever they change
  useEffect(() => {
    console.log('Saving lists to localStorage:', lists);
    localStorage.setItem('todoLists', JSON.stringify(lists));
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
        id: `task-${Date.now()}`,
        text: inputValue.trim(),
        completed: false
      };
      
      setLists(prev => ({
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
      }));
      
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

  const handleTaskUpdate = (taskId, newText) => {
    if (newText.trim() === '') return;
    
    setLists(prev => {
      const updatedSections = { ...prev.personal.sections };
      Object.keys(updatedSections).forEach(sectionId => {
        const taskIndex = updatedSections[sectionId].tasks.findIndex(t => t.id === taskId);
        if (taskIndex !== -1) {
          updatedSections[sectionId] = {
            ...updatedSections[sectionId],
            tasks: updatedSections[sectionId].tasks.map((t, i) => 
              i === taskIndex ? { ...t, text: newText } : t
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

  const handleAddList = () => {
    if (newListName.trim() === '') return;
    
    const newSectionId = `section-${Date.now()}`;
    const newSection = {
      id: newSectionId,
      title: newListName.trim(),
      tasks: []
    };
    
    setLists(prev => ({
      ...prev,
      personal: {
        ...prev.personal,
        sections: {
          ...prev.personal.sections,
          [newSectionId]: newSection
        },
        sectionOrder: [...prev.personal.sectionOrder, newSectionId]
      }
    }));
    
    setActiveSection(newSectionId);
    setIsAddingList(false);
    setNewListName('');
  };

  return (
    <div className="main-page">
      <div className="centered-box">
        <div className="content-container">
          <div className="left-space">
            <div className="sidebar">
              <h2 className="list-title">{(currentList && currentList.title) || 'My Lists'}</h2>
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
