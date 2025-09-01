import React, { useEffect, useState } from 'react';
import API from '../utils/api';
import '../styles/PayrollPage.css';

function PayrollPage() {
  const [payrolls, setPayrolls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPayroll, setCurrentPayroll] = useState(null);
  const [selectedPeriod, setSelectedPeriod] = useState('current');

  useEffect(() => {
    Promise.all([
      API.get('/payroll/me'),
      API.get('/payroll/current') // Assuming endpoint for current month
    ])
    .then(([payrollRes, currentRes]) => {
      setPayrolls(payrollRes.data);
      setCurrentPayroll(currentRes.data);
      setLoading(false);
    })
    .catch(() => {
      setPayrolls([]);
      setLoading(false);
    });
  }, []);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(amount || 0);
  };

  const getCurrentMonth = () => {
    return new Date().toLocaleDateString('en-US', { 
      month: 'long', 
      year: 'numeric' 
    });
  };

  const getYTDTotal = () => {
    return payrolls.reduce((total, payroll) => total + (payroll.totalSalary || 0), 0);
  };

  if (loading) {
    return (
      <div className="dashboard-loading">
        <div className="spinner"></div>
        <div className="loading-text">Loading your payroll information...</div>
      </div>
    );
  }

  return (
    <div className="payroll-wrapper">
      <div className="payroll-container fade-in">
        {/* Payroll Header */}
        <div className="payroll-header">
          <h1 className="payroll-title">Payroll & Compensation</h1>
          <p className="payroll-subtitle">
            View your salary details, earnings, and payment history
          </p>
          <div className="current-period">
            <span>📅</span>
            Current Period: {getCurrentMonth()}
          </div>
        </div>

        {/* Payroll Summary */}
        <div className="payroll-summary">
          <div className="summary-card gross">
            <div className="summary-icon gross">
              <span>💰</span>
            </div>
            <div className="summary-label">Gross Salary</div>
            <div className="summary-value">
              {formatCurrency(currentPayroll?.totalSalary || 0)}
            </div>
            <div className="summary-change positive">
              <span>↗️</span> +5.2% from last month
            </div>
          </div>

          <div className="summary-card deductions">
            <div className="summary-icon deductions">
              <span>📉</span>
            </div>
            <div className="summary-label">Deductions</div>
            <div className="summary-value">
              {formatCurrency(currentPayroll?.deductions || 0)}
            </div>
            <div className="summary-change negative">
              <span>📊</span> Taxes & Benefits
            </div>
          </div>

          <div className="summary-card net">
            <div className="summary-icon net">
              <span>💵</span>
            </div>
            <div className="summary-label">Net Pay</div>
            <div className="summary-value">
              {formatCurrency((currentPayroll?.totalSalary || 0) - (currentPayroll?.deductions || 0))}
            </div>
            <div className="summary-change positive">
              <span>✅</span> Available
            </div>
          </div>

          <div className="summary-card ytd">
            <div className="summary-icon ytd">
              <span>📊</span>
            </div>
            <div className="summary-label">YTD Earnings</div>
            <div className="summary-value">
              {formatCurrency(getYTDTotal())}
            </div>
            <div className="summary-change positive">
              <span>📈</span> Year to Date
            </div>
          </div>
        </div>

        {/* Payroll Details */}
        <div className="payroll-details">
          <div className="payslip-section">
            <h3 className="section-title">
              <span>🧾</span>
              Current Payslip Details
            </h3>
            
            <div className="payslip-item">
              <span className="item-label">Base Salary</span>
              <span className="item-value positive">
                {formatCurrency(currentPayroll?.baseSalary || 0)}
              </span>
            </div>
            
            <div className="payslip-item">
              <span className="item-label">Overtime Hours</span>
              <span className="item-value">
                {currentPayroll?.overtimeHours || 0} hrs
              </span>
            </div>
            
            <div className="payslip-item">
              <span className="item-label">Overtime Pay</span>
              <span className="item-value positive">
                {formatCurrency((currentPayroll?.overtimeHours || 0) * (currentPayroll?.overtimeRate || 0))}
              </span>
            </div>
            
            <div className="payslip-item">
              <span className="item-label">Allowances</span>
              <span className="item-value positive">
                {formatCurrency(currentPayroll?.allowances || 0)}
              </span>
            </div>
            
            <div className="payslip-item">
              <span className="item-label">Health Insurance</span>
              <span className="item-value negative">
                -{formatCurrency(currentPayroll?.healthInsurance || 0)}
              </span>
            </div>
            
            <div className="payslip-item">
              <span className="item-label">Tax Deductions</span>
              <span className="item-value negative">
                -{formatCurrency(currentPayroll?.taxDeductions || 0)}
              </span>
            </div>

            <div className="total-row">
              <div className="payslip-item">
                <span className="item-label">Net Salary</span>
                <span className="item-value">
                  {formatCurrency((currentPayroll?.totalSalary || 0) - (currentPayroll?.deductions || 0))}
                </span>
              </div>
            </div>
          </div>

          <div className="quick-actions">
            <h3 className="section-title">
              <span>⚡</span>
              Quick Actions
            </h3>
            
            <button className="action-button primary">
              <span>📥</span>
              Download Payslip
            </button>
            
            <button className="action-button secondary">
              <span>📊</span>
              View Tax Statement
            </button>
            
            <button className="action-button secondary">
              <span>📧</span>
              Email Payslip
            </button>
            
            <button className="action-button secondary">
              <span>🏦</span>
              Banking Details
            </button>
            
            <button className="action-button secondary">
              <span>📋</span>
              Salary Certificate
            </button>
          </div>
        </div>

        {/* Payroll History */}
        <div className="payroll-history">
          <div className="history-header">
            <h3 className="history-title">
              <span>📈</span>
              Payroll History
            </h3>
            <div className="filter-controls">
              <select 
                className="period-filter"
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value)}
              >
                <option value="current">Current Year</option>
                <option value="last">Last Year</option>
                <option value="all">All Time</option>
              </select>
              <button className="btn-secondary">
                <span>📊</span>
                Generate Report
              </button>
            </div>
          </div>

          <div className="table-container">
            {payrolls.length > 0 ? (
              <table className="payroll-table">
                <thead>
                  <tr>
                    <th>Period</th>
                    <th>Base Salary</th>
                    <th>Overtime</th>
                    <th>Gross Pay</th>
                    <th>Deductions</th>
                    <th>Net Pay</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {payrolls.map(p => (
                    <tr key={p._id}>
                      <td>
                        <div className="period-badge">
                          {p.month || 'N/A'}
                        </div>
                      </td>
                      <td>
                        <div className="amount-badge positive">
                          {formatCurrency(p.baseSalary)}
                        </div>
                      </td>
                      <td>
                        <span className="text-gray-600">
                          {p.overtimeHours || 0}h @ {formatCurrency(p.overtimeRate || 0)}/h
                        </span>
                      </td>
                      <td>
                        <div className="amount-badge positive">
                          {formatCurrency(p.totalSalary)}
                        </div>
                      </td>
                      <td>
                        <span className="text-gray-600">
                          {formatCurrency(p.deductions || 0)}
                        </span>
                      </td>
                      <td>
                        <div className="amount-badge positive">
                          {formatCurrency((p.totalSalary || 0) - (p.deductions || 0))}
                        </div>
                      </td>
                      <td>
                        <div className={`status-badge ${p.status || 'pending'}`}>
                          {p.status || 'Processed'}
                        </div>
                      </td>
                      <td>
                        <button 
                          className="download-link"
                          onClick={() => console.log('Download payslip for', p._id)}
                        >
                          <span>📥</span>
                          Download
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="empty-state">
                <div className="empty-icon">
                  <span>💰</span>
                </div>
                <h4 className="empty-title">No Payroll Records</h4>
                <p className="empty-description">
                  Your payroll history will appear here once processed by HR.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default PayrollPage;
