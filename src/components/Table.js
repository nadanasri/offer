import React, { useState, useEffect } from 'react';
import SearchBar from './SearchBar '; 
import FilterDropdown from './FilterDropdown '; 
import FormControl from './FormControl';
import Loader from './Loader';
import { ApiOffer } from '../API/ApiOffer';
import '../App.css';

const Table = () => {
  const [tableData, setTableData] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [editingOffer, setEditingOffer] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [filteredData, setFilteredData] = useState([]);
  const [totals, setTotals] = useState({
    impressions: 0,
    conversions: 0,
    revenue: 0,
    conversionRate: '0.00',
  });

  useEffect(() => {
    handleLoader(fetchOffers);
  }, []);

  useEffect(() => {
    const filtered = tableData.filter((item) => {
      const matchesSearch =
        item.discountCode?.toLowerCase().includes(searchTerm) ||
        item.impressions?.toString().includes(searchTerm) ||
        item.conversions?.toString().includes(searchTerm) ||
        item.revenue?.toString().includes(searchTerm) ||
        item.conversionRate?.toString().includes(searchTerm);

      const matchesStatus =
        statusFilter === 'all'
          ? true
          : statusFilter === 'enabled'
          ? item.isEnabled
          : !item.isEnabled;

      return matchesSearch && matchesStatus;
    });

    setFilteredData(filtered);
  }, [tableData, searchTerm, statusFilter]);

  useEffect(() => {
    const calculatedTotals = filteredData.reduce(
      (acc, item) => ({
        impressions: acc.impressions + (item.impressions || 0),
        conversions: acc.conversions + (item.conversions || 0),
        revenue: acc.revenue + (item.revenue || 0),
      }),
      { impressions: 0, conversions: 0, revenue: 0 }
    );

    const totalConversionRate =
      calculatedTotals.impressions > 0
        ? (
            (calculatedTotals.conversions / calculatedTotals.impressions) *
            100
          ).toFixed(2)
        : '0.00';

    setTotals({
      ...calculatedTotals,
      conversionRate: totalConversionRate,
    });
  }, [filteredData]);

  const handleToggle = async (id) => {
    const offer = tableData.find((item) => item.id === id);
    await handleLoader(async () => {
      const updatedOffer = await ApiOffer.updateOffer(id, {
        ...offer,
        isEnabled: !offer.isEnabled,
      });
      setTableData((prevData) =>
        prevData.map((item) => (item.id === id ? updatedOffer : item))
      );
    });
  };

  const handleSearch = (value) => {
    setSearchTerm(value.toLowerCase());
  };

  const handleFilterChange = (value) => {
    setStatusFilter(value);
  };

  const handleAddOffer = async (offerData) => {
    await handleLoader(async () => {
      if (editingOffer) {
        const updatedOffer = await ApiOffer.updateOffer(editingOffer.id, offerData);
        setTableData((prevData) =>
          prevData.map((item) =>
            item.id === editingOffer.id ? updatedOffer : item
          )
        );
      } else {
        const createdOffer = await ApiOffer.createOffer(offerData);
        setTableData((prevData) => [...prevData, createdOffer]);
      }
      setIsFormVisible(false);
      setEditingOffer(null);
    });
  };

  const handleLoader = async (action, ...args) => {
    try {
      setLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 3000)); // 3-second loader
      await action(...args);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (offer) => {
    setEditingOffer(offer);
    setIsFormVisible(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this offer?')) {
      await handleLoader(async () => {
        await ApiOffer.deleteOffer(id);
        setTableData((prevData) => prevData.filter((item) => item.id !== id));
      });
    }
  };

  const fetchOffers = async () => {
    try {
      const data = await ApiOffer.getAllOffers();
      setTableData(data);
      setError(null);
    } catch (err) {
      setError(err.message);
      console.error(err);
    }
  };

  const handleCancel = () => {
    setIsFormVisible(false);
    setEditingOffer(null);
  };

  return (
    <div className="dashboard-container">
      <Loader isLoading={loading}>
        {error ? (
          <div className="error">{error}</div>
        ) : (
          <>
            {isFormVisible ? (
              <FormControl
                onSubmit={handleAddOffer}
                onCancel={handleCancel}
                editData={editingOffer}
              />
            ) : (
              <>
                <div className="table-controls">
                  <div className="table-controls-left">
                    <SearchBar onSearch={handleSearch} />
                    <FilterDropdown
                      onFilterChange={handleFilterChange}
                      currentFilter={statusFilter}
                    />
                  </div>
                  <button
                    className="create-button"
                    onClick={() => setIsFormVisible(true)}
                    disabled={loading}
                  >
                    Create New Offer
                  </button>
                </div>

                <div className="table-container">
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th></th>
                        <th>Offer</th>
                        <th>Impressions</th>
                        <th>Conversions</th>
                        <th>Revenue</th>
                        <th>Conversion Rate</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredData.map((item) => (
                        <tr key={item.id}>
                          <td>
                            <label className="switch">
                              <input
                                type="checkbox"
                                checked={item.isEnabled}
                                onChange={() => handleToggle(item.id)}
                              />
                              <span className="slider round"></span>
                            </label>
                          </td>
                          <td>{item.discountCode}</td>
                          <td>{item.impressions}</td>
                          <td>{item.conversions}</td>
                          <td>$ {item.revenue?.toFixed(2)}</td>
                          <td>
                            {typeof item.conversionRate === 'number' &&
                            !isNaN(item.conversionRate)
                              ? item.conversionRate.toFixed(2)
                              : '0.00'}{' '}
                            %
                          </td>
                          <td>
                            <button
                              className="edit-button"
                              onClick={() => handleEdit(item)}
                              disabled={loading}
                            >
                              Edit
                            </button>
                            <button
                              className="delete-button"
                              onClick={() => handleDelete(item.id)}
                              disabled={loading}
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                      <tr className="totals-row">
                        <td></td>
                        <td>Total</td>
                        <td>{totals.impressions}</td>
                        <td>{totals.conversions}</td>
                        <td>${totals.revenue.toFixed(2)}</td>
                        <td>{totals.conversionRate}%</td>
                        <td></td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </>
            )}
          </>
        )}
      </Loader>
    </div>
  );
};

export default Table;
