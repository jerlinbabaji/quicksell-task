import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css'; // Make sure to create styles for layout

// Import SVG icons
import ToDoIcon from './assets/icons_FEtask/To-do.svg';
import UrgentGreyIcon from './assets/icons_FEtask/SVG - Urgent Priority grey.svg';
import UrgentColorIcon from './assets/icons_FEtask/SVG - Urgent Priority colour.svg';
import NoPriorityIcon from './assets/icons_FEtask/No-priority.svg';
import InProgressIcon from './assets/icons_FEtask/in-progress.svg';
import MediumPriorityIcon from './assets/icons_FEtask/Img - Medium Priority.svg';
import BacklogIcon from './assets/icons_FEtask/Backlog.svg';
import CancelledIcon from './assets/icons_FEtask/Cancelled.svg';
import DoneIcon from './assets/icons_FEtask/Done.svg';
import DisplayIcon from './assets/icons_FEtask/Display.svg';
import userimg from './assets/user.jpeg'

const App = () => {
  const [cards, setCards] = useState([]);
  const [users, setUsers] = useState([]);
  const [groupBy, setGroupBy] = useState('status');
  const [orderBy, setOrderBy] = useState('priority');
  const [displayDropdownOpen, setDisplayDropdownOpen] = useState(false);
  
  useEffect(() => {
    // Fetch data from API
    axios.get('https://api.quicksell.co/v1/internal/frontend-assignment')
      .then(response => {
        setCards(response.data.tickets);
        setUsers(response.data.users);
      })
      .catch(error => {
        console.error('Error fetching card data:', error);
      });
  }, []);
  
  const handleGroupChange = (e) => {
    setGroupBy(e.target.value);
  };

  const handleOrderChange = (e) => {
    setOrderBy(e.target.value);
  };

  const toggleDisplayDropdown = () => {
    setDisplayDropdownOpen(!displayDropdownOpen);
  };

  const groupCards = (cards) => {
    switch(groupBy) {
      case 'status':
        return groupByStatus(cards);
      case 'user':
        return groupByUser(cards);
      case 'priority':
        return groupByPriority(cards);
      default:
        return cards;
    }
  };

  const sortCards = (cards) => {
    return cards.sort((a, b) => {
      if (orderBy === 'priority') {
        return a.priority - b.priority;
      } else if (orderBy === 'user') {
        return a.userId.localeCompare(b.userId);
      } else if (orderBy === 'status') {
        return a.status.localeCompare(b.status);
      } else {
        return 0;
      }
    });
  };

  const groupByStatus = (cards) => {
    const grouped = {
      Backlog: [],
      Todo: [],
      'In Progress': [],
      Done: [],
      Cancelled: 0
    };
    
    cards.forEach(card => {
      if (card.status === 'Cancelled') {
        grouped.Cancelled += 1; // Increment cancelled count
      } else {
        grouped[card.status]?.push(card);
      }
    });

    return grouped;
  };

  const groupByUser = (cards) => {
    const grouped = {};
    const userMap = {};

    users.forEach(user => {
      userMap[user.id] = user.name;
    });

    cards.forEach(card => {
      const userName = userMap[card.userId] || 'Unknown';
      grouped[userName] = grouped[userName] || [];
      grouped[userName].push(card);
    });
    
    return grouped;
  };

  const groupByPriority = (cards) => {
    const grouped = {
      Urgent: [],
      High: [],
      Medium: [],
      Low: [],
      'No Priority': []
    };
    
    cards.forEach(card => {
      const priority = card.priority;
      if (priority === 4) {
        grouped['Urgent'].push(card);
      } else if (priority === 3) {
        grouped['High'].push(card);
      } else if (priority === 2) {
        grouped['Medium'].push(card);
      } else if (priority === 1) {
        grouped['Low'].push(card);
      } else {
        grouped['No Priority'].push(card);
      }
    });
    return grouped;
  };

  const renderGroupedCards = () => {
    const groupedCards = groupCards(sortCards(cards)); // Ensure cards are sorted before grouping
  
    const statusIcons = {
      Backlog: BacklogIcon,
      'In Progress': InProgressIcon,
      Done: DoneIcon,
      Cancelled: CancelledIcon,
      Todo: ToDoIcon, // Assuming you have this imported or available
    };
  
    if (groupBy === 'priority') {
      return (
        <div className="priority-columns">
          {Object.keys(groupedCards).map((priority, index) => (
            <div key={index} className="column">
              <h4>
                
              </h4>
              <h4 style={{ display: 'inline' }}>
              {priority === 'Urgent' && <img src={UrgentColorIcon} alt="Urgent Icon" className="icon" />}
                {priority === 'High' && <img src={UrgentGreyIcon} alt="High Priority Icon" className="icon" />}
                {priority === 'Medium' && <img src={MediumPriorityIcon} alt="Medium Priority Icon" className="icon" />}
                {priority === 'Low' && <img src={NoPriorityIcon} alt="Low Priority Icon" className="icon" />}
                {priority === 'No Priority' && <img src={NoPriorityIcon} alt="No Priority Icon" className="icon" />}
                {priority}
            </h4>
            <span style={{ marginLeft: '5px' }}>{groupedCards[priority].length}</span>

              {groupedCards[priority].map(card => (
                <div key={card.id} className="card">
                  <div className="card-header">
                    <div className="card-id">{card.id}</div>
                    <img src={userimg} alt="User" className="user-avatar" />
                  </div>
                  <h5 className="card-title">
                    <img
                      src={statusIcons[card.status] || BacklogIcon}   
                      alt={`${card.status} Icon`}
                      className="status-icon"
                    />
                    {card.title}
                  </h5>
                  <p>{card.tag.join(', ')}</p>
                </div>
              ))}
            </div>
          ))}
        </div>
      );
    }
  
    if (groupBy === 'status') {
      const statusLabels = [
        { label: 'Backlog', icon: BacklogIcon, key: 'Backlog' },
        { label: 'Todo', icon: ToDoIcon, key: 'Todo' },
        { label: 'In Progress', icon: InProgressIcon, key: 'In Progress' },
        { label: 'Done', icon: DoneIcon, key: 'Done' },
        { label: 'Cancelled', icon: CancelledIcon, key: 'Cancelled' },
      ];
  
      return (
        <div className="status-columns">
          {statusLabels.map((status, index) => (
            <div key={index} className="column">
              <h4 style={{ display: 'inline' }}>
              <img src={status.icon} alt={`${status.label} Icon`} className="icon" /> {status.label}
            </h4>
            {status.key !== 'Cancelled' && (
              <span style={{ marginLeft: '5px' }}>
                {groupedCards[status.key].length}
              </span>
            )}
              {status.key === 'Cancelled' ? (
                <p>Count: {groupedCards.Cancelled}</p>
              ) : (
                groupedCards[status.key].map(card => (
                  <div key={card.id} className="card">
                    <div className="card-header">
                      <div className="card-id">{card.id}</div>
                      <img src={userimg} alt="User" className="user-avatar" />
                    </div>
                    <h5 className="card-title">
                      <img
                        src={statusIcons[card.status] || BacklogIcon}
                        alt={`${card.status} Icon`}
                        className="status-icon"
                      />
                      {card.title}
                    </h5>
                    <p>{card.tag.join(', ')}</p>
                  </div>
                ))
              )}
            </div>
          ))}
        </div>
      );
    }
  
    if (groupBy === 'user') {
      return (
        <div className="user-columns">
          {Object.keys(groupedCards).map((user, index) => (
            <div key={index} className="column">
              <h4 style={{ display: 'inline' }}>
              {user}
            </h4>
            <span style={{ marginLeft: '5px' }}>{groupedCards[user].length}</span>

              {groupedCards[user].map(card => (
                <div key={card.id} className="card">
                  <div className="card-header">
                    <div className="card-id">{card.id}</div>
                    <img src={userimg} alt="User" className="user-avatar" />
                  </div>
                  <h5 className="card-title">
                    <img
                      src={statusIcons[card.status] || BacklogIcon}
                      alt={`${card.status} Icon`}
                      className="status-icon"
                    />
                    {card.title}
                  </h5>
                  <p>{card.tag.join(', ')}</p>
                </div>
              ))}
            </div>
          ))}
        </div>
      );
    }
  
    return Object.keys(groupedCards).map((group, index) => (
      <div key={index} className="column">
        <h4 style={{ display: 'inline' }}>
          {group}
        </h4>
        <span style={{ marginLeft: '5px' }}>({groupedCards[group].length})</span>

        {groupedCards[group].map((card) => (
          <div key={card.id} className="card">
            <div className="card-header">
              <div className="card-id">{card.id}</div>
              <img src={card.userImage} alt="User" className="user-avatar" />
            </div>
            <h3 className="card-title">
              <img
                src={statusIcons[card.status] || BacklogIcon}
                alt={`${card.status} Icon`}
                className="status-icon"
              />
              {card.title}
            </h3>
            <div className="card-tags">
              <div className="card-priority-tag">
                <img src={UrgentColorIcon} alt="Priority Icon" className="priority-icon" />
                Feature Request
              </div>
            </div>
          </div>
        ))}
      </div>
    ));
  };
  
  
  // Render the app layout
  return (
    <div className="App">
      <div className="controls">
        <button onClick={toggleDisplayDropdown} className="dropdown-button">
          <img src={DisplayIcon} alt="Display Icon" className="icon" /> Display
        </button>
        {/* Add the 'show-dropdown' class based on the state */}
        <div className={`dropdown-content ${displayDropdownOpen ? 'show-dropdown' : ''}`}>
          <label>
            Group By:
            <select value={groupBy} onChange={handleGroupChange}>
              <option value="status">Status</option>
              <option value="user">User</option>
              <option value="priority">Priority</option>
            </select>
          </label>
          <label>
            Order By:
            <select value={orderBy} onChange={handleOrderChange}>
              <option value="priority">Priority</option>
              <option value="user">User</option>
              <option value="status">Status</option>
            </select>
          </label>
        </div>
      </div>
      <div className="columns">
        {renderGroupedCards()}
      </div>
    </div>
  );
};

export default App;