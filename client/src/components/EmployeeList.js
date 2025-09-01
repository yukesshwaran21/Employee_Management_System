import React, { useEffect, useState } from 'react';
import API from '../utils/api';
import '../styles/Components.css';

function EmployeeList() {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [departments, setDepartments] = useState([]);

  useEffect(() => {
    fetchEmployees();
    fetchDepartments();
  }, []);

  const fetchEmployees = async () => {
    try {
      const res = await API.get('/employees');
      setEmployees(res.data);
    } catch (error) {
      console.error('Error fetching employees:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchDepartments = async () => {
    try {
      const res = await API.get('/departments');
      setDepartments(res.data);
    } catch (error) {
      console.error('Error fetching departments:', error);
    }
  };

  const filteredEmployees = employees.filter(emp => {
    const matchesSearch = emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         emp.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDepartment = !selectedDepartment || emp.department?.name === selectedDepartment;
    return matchesSearch && matchesDepartment;
  });

  const getInitials = (name) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  if (loading) {
    return (
      <div className="component-loading">
        <div className="spinner"></div>
        <span>Loading employees...</span>
      </div>
    );
  }

  return (
    <div className="employee-list-container">
      <div className="employee-list-header">
        <div>
          <h3 className="employee-list-title">
            <span>👥</span>
            Employee Directory
            <div className="employee-count">
              {filteredEmployees.length} employees
            </div>
          </h3>
        </div>
        <div className="search-filter">
          <input
            type="text"
            placeholder="Search employees..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          <select
            value={selectedDepartment}
            onChange={(e) => setSelectedDepartment(e.target.value)}
            className="department-filter"
          >
            <option value="">All Departments</option>
            {departments.map(dept => (
              <option key={dept._id} value={dept.name}>
                {dept.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {filteredEmployees.length === 0 ? (
        <div className="component-empty">
          <div className="empty-icon">👥</div>
          <div className="empty-title">No employees found</div>
          <div className="empty-description">
            Try adjusting your search criteria or department filter
          </div>
        </div>
      ) : (
        <div className="employee-grid">
          {filteredEmployees.map(emp => (
            <div key={emp._id} className="employee-card">
              <div className="employee-avatar">
                {getInitials(emp.name)}
              </div>
              <div className="employee-info">
                <h4>{emp.name}</h4>
                <div className="employee-email">{emp.email}</div>
                <div className="employee-meta">
                  <div className="meta-item">
                    <span className="meta-label">Department:</span>
                    <span className="meta-value">{emp.department?.name || 'Not assigned'}</span>
                  </div>
                  <div className="meta-item">
                    <span className="meta-label">Employee ID:</span>
                    <span className="meta-value">{emp.employeeId || 'N/A'}</span>
                  </div>
                  <div className="meta-item">
                    <span className="meta-label">Status:</span>
                    <span className={`status-badge ${emp.status?.toLowerCase()}`}>
                      {emp.status || 'Active'}
                    </span>
                  </div>
                  <div className="meta-item">
                    <span className="meta-label">Join Date:</span>
                    <span className="meta-value">
                      {emp.joinDate ? new Date(emp.joinDate).toLocaleDateString() : 'N/A'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default EmployeeList;
