import React, { useState } from 'react';
import { CircularProgress, FormControlLabel, Switch, Grid, Box } from '@mui/material';
import TradingViewChart from '../../components/TradingViewChart';
import WatchList from '../../components/WatchList';
import WatchListItem from '../../components/WatchListItem';
import Logout from '../../components/Auth/Logout';
import AccountManagement from './account/AccountManagement';
import { Item } from './StyledComponents';

const TradingPage = ({
  setIsAuth,
  setActiveGroup,
  loading,
  useSimulator,
  setUseSimulator,
  handleAccountChange,
  accounts,
  selectedSymbol,
  setSelectedSymbol,
  isAuth,
  symbols,
  bid,
  ask,
  setBid,
  setAsk,
  balance,
  setBalance,
  amount,
  setAmount,
  handleOption,
  getBidIndex,
  calculateProfit,
  calculateLoss,
  menuVisible,
  setMenuVisible,
  handleMouseEnter,
  handleMouseLeave,
  groupedSymbols,
  activeGroup,
  APIs,
  openPositionsData,
  marginUsed,
  marginAvailable
}) => {
  // New state variables for adjustable inputs
  const [pipCount, setPipCount] = useState('');
  const [percentageLoss, setPercentageLoss] = useState('');
  const [price, setPrice] = useState('');

  return (
    <>
      {loading ? (
        <div className="loading-container">
          <CircularProgress className="circular-progress" color="success" />
        </div>
      ) : (
        <div>
          <div style={{ height: '50px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <p className="text-white m-6">Laser Trader</p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginRight: '20px' }}>
              <FormControlLabel
                control={
                  <Switch
                    checked={useSimulator}
                    onChange={(e) => {
                      setUseSimulator(e.target.checked);
                      localStorage.setItem('useSimulator', e.target.checked);
                    }}
                    color="primary"
                  />
                }
                label={<span style={{ color: 'white' }}>Use Simulator</span>}
              />
              <Logout />
            </div>
          </div>
          <select
            onChange={handleAccountChange}
            className="account-switch"
            defaultValue={localStorage.getItem('tradeToken')}
          >
            {accounts.map((account, index) => (
              <option key={index} value={account.token}>
                {account.id} - {account.type} ({account.balance})
              </option>
            ))}
          </select>
          <div className="ml-16 pt-10">
            <WatchListItem
              fromCurrency={selectedSymbol.slice(0, 3)}
              toCurrency={selectedSymbol.slice(3, 6)}
            />
          </div>

          <div className="trading-page-container">
            <div className="tradingview-container pl-10">
              <div className="chart-container">
                <Grid container spacing={2}>
                  <Grid item xs={8}>
                    <Item sx={{ height: isAuth ? '675px' : '700px' }} p={5}>
                      <TradingViewChart
                        selectedSymbol={selectedSymbol}
                        setSelectedSymbol={setSelectedSymbol}
                      />
                    </Item>
                  </Grid>
                  <Grid
                    item
                    xs={4}
                    sx={{ display: 'flex', flexDirection: 'column' }}
                  >
                    <Item sx={{ height: '80%' }} p={5}>
                      <WatchList
                        height={isAuth ? '500' : '700'}
                        symbols={symbols}
                        bid={bid}
                        ask={ask}
                        setSelectedSymbol={setSelectedSymbol}
                      />

                      <div className="trading-setting space-y-2">
                        {/* Symbol selection dropdown */}
                        <div className="flex space-x-2 w-full justify-between">
                          <div
                            className="dropdown w-1/3"
                            onMouseLeave={handleMouseLeave}
                          >
                            <button
                              className="dropbtn w-full"
                              onMouseEnter={handleMouseEnter}
                              onClick={() => setMenuVisible((prev) => !prev)}
                            >
                              {selectedSymbol === ''
                                ? 'Select Symbol'
                                : selectedSymbol}
                            </button>
                            {menuVisible && (
                              <div
                                className="dropdown-content"
                                onMouseEnter={handleMouseEnter}
                              >
                                {groupedSymbols.map((group) => (
                                  <div
                                    key={group.assetName}
                                    onMouseEnter={() =>
                                      setActiveGroup(group.assetName)
                                    }
                                    onMouseLeave={() => setActiveGroup(null)}
                                    className="dropdown-group"
                                  >
                                    <div
                                      className={`group-label ${
                                        activeGroup === group.assetName
                                          ? 'active'
                                          : ''
                                      }`}
                                    >
                                      {group.assetName}
                                      <span className="arrow">
                                        {activeGroup === group.assetName
                                          ? '->'
                                          : ''}
                                      </span>
                                    </div>
                                    {activeGroup === group.assetName && (
                                      <div className="child-menu">
                                        {group.symbols.map((symbol) => (
                                          <div
                                            key={symbol.code}
                                            onClick={() => {
                                              setSelectedSymbol(symbol.code);
                                              setMenuVisible(false);
                                            }}
                                            className="child-item"
                                          >
                                            {symbol.name}
                                          </div>
                                        ))}
                                      </div>
                                    )}
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>

                          {/* Sell button */}
                          <div className="flex w-2/3 space-x-2">
                            <button
                              onClick={() => handleOption(true)}
                              className="trading-sell px-[33px] bg-[#298f37] rounded-lg text-white"
                              disabled={selectedSymbol === ''}
                            >
                              Sell
                            </button>

                            {/* Amount input */}
                            <input
                              value={amount}
                              className="trading-amount text-center"
                              onChange={(e) => setAmount(e.target.value)}
                              style={{
                                backgroundColor: 'rgb(40, 40, 40)',
                                color: 'white'
                              }}
                            />

                            {/* Buy button */}
                            <button
                              onClick={() => handleOption(false)}
                              className="trading-buy px-8 bg-[#8f2828] rounded-lg text-white"
                              disabled={selectedSymbol === ''}
                            >
                              Buy
                            </button>
                          </div>
                        </div>

                        {/* Adjustable Inputs */}
                        <div className="adjustable-inputs-container">
                          <div className="adjustable-input">
                            <label htmlFor="balance-input" style={{ color: 'white' }}>Balance:</label>
                            <input
                              type="number"
                              id="balance-input"
                              value={balance}
                              onChange={(e) => setBalance(e.target.value)}
                              style={{ backgroundColor: '#171b25', color: 'white', padding: '10px', borderRadius: '5px', width: '100%' }}
                            />
                          </div>
                          <div className="adjustable-input">
                            <label htmlFor="pip-count-input" style={{ color: 'white' }}>Pip Count:</label>
                            <input
                              type="number"
                              id="pip-count-input"
                              value={pipCount}
                              onChange={(e) => setPipCount(e.target.value)}
                              style={{ backgroundColor: '#171b25', color: 'white', padding: '10px', borderRadius: '5px', width: '100%' }}
                            />
                          </div>
                          <div className="adjustable-input">
                            <label htmlFor="percentage-loss-input" style={{ color: 'white' }}>Percentage Loss:</label>
                            <input
                              type="number"
                              id="percentage-loss-input"
                              value={percentageLoss}
                              onChange={(e) => setPercentageLoss(e.target.value)}
                              style={{ backgroundColor: '#171b25', color: 'white', padding: '10px', borderRadius: '5px', width: '100%' }}
                            />
                          </div>
                          <div className="adjustable-input">
                            <label htmlFor="price-input" style={{ color: 'white' }}>Price:</label>
                            <input
                              type="number"
                              id="price-input"
                              value={price}
                              onChange={(e) => setPrice(e.target.value)}
                              style={{ backgroundColor: '#171b25', color: 'white', padding: '10px', borderRadius: '5px', width: '100%' }}
                            />
                          </div>
                        </div>

                        {/* Rest of the trading interface remains unchanged */}
                        <div
                          style={{
                            display: 'flex',
                            gap: '15px',
                            borderRadius: '10px',
                            marginTop: '3px',
                            width: '100%',
                            justifyContent: 'space-between',
                            alignItems: 'center'
                          }}
                        >
                          <button
                            style={{
                              display: 'flex',
                              justifyContent: 'space-between',
                              alignItems: 'center',
                              backgroundColor: '#171b25',
                              color: 'grey',
                              padding: '10px',
                              borderRadius: '10px',
                              width: '100%'
                            }}
                          >
                            <p>{bid[getBidIndex(selectedSymbol)]}</p>
                          </button>
                          <p style={{ fontSize: '12px', color: 'white' }}>
                            Price
                          </p>
                          <button
                            style={{
                              display: 'flex',
                              justifyContent: 'space-between',
                              alignItems: 'center',
                              backgroundColor: '#171b25',
                              color: 'grey',
                              padding: '10px',
                              borderRadius: '10px',
                              width: '100%'
                            }}
                          >
                            <p style={{ fontSize: '12px' }}>
                              {ask[getBidIndex(selectedSymbol)]}
                            </p>
                          </button>
                        </div>
                        {/* Additional trading details and components... */}
                      </div>
                    </Item>
                  </Grid>
                </Grid>
              </div>
              <Box p={1}></Box>
              {isAuth && (
                <Box
                  sx={{
                    borderRadius: '10px',
                    marginBottom: '0px',
                    flex: '33.01 1 0px'
                  }}
                  key="account-management"
                >
                  <AccountManagement
                    setIsAuth={setIsAuth}
                    selectedSymbol={selectedSymbol}
                    setSelectedSymbol={setSelectedSymbol}
                    symbols={symbols}
                    bid={bid}
                    setBid={setBid}
                    ask={ask}
                    apis={APIs}
                    setAsk={setAsk}
                    balance={balance}
                    setBalance={setBalance}
                    openPositionsData={openPositionsData}
                    marginUsed={marginUsed}
                    marginAvailable={marginAvailable}
                  />
                </Box>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default TradingPage;
