import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event'
import App from './App';

test('renders side panel', async () => {
  render(<App />);
  const linkElement = screen.getByText(/Welcome to DECOM Report tool/i);
  expect(linkElement).toBeInTheDocument();

  const waitElement = screen.getByText(/Please choose a report from the side panel./i);
  expect(waitElement).toBeInTheDocument();

  const report1ButtonElement = screen.getByText(/Turnover per brand/i);
  expect(report1ButtonElement).toBeInTheDocument();

  const report2ButtonElement = screen.getByText(/Turnover per day/i);
  expect(report2ButtonElement).toBeInTheDocument();

});


/* Run tests for Report 1 */
test('Test report 1', async () => {
  render(<App />);

  // Select first report
  const report1ButtonElement = screen.getByText(/Turnover per brand/i);
  userEvent.click(report1ButtonElement);

  // Check get report button rendered
  const getReportButtonElement = screen.getByText(/Get report/i);
  expect(getReportButtonElement).toBeInTheDocument();

  // set from date
  await screen.findByTestId(/from/i);
  fireEvent.change(screen.getByTestId('from'), {target: {value: '2018-12-01'}});

  // Click to get report
  userEvent.click(getReportButtonElement);

  // Wait for render report name
  await screen.findByText(/Turnover per brand/i);

  // Wait for render report data
  await screen.findByText(/Name/i);

  // Check report data (O-Brand and it's value )
  expect(screen.getByText(/O-Brand/i)).toBeInTheDocument();
  expect(screen.getByText(/165856.46/i)).toBeInTheDocument();

});

/* Set 'from' and 'to' values */
test('Test report 1 by setting from and to values to 2018-12-01', async () => {
  render(<App />);

  // Select first report
  const report1ButtonElement = screen.getByText(/Turnover per brand/i);
  userEvent.click(report1ButtonElement);

  // set from date
  await screen.findByTestId(/from/i);
  fireEvent.change(screen.getByTestId('from'), {target: {value: '2018-12-01'}});
  fireEvent.change(screen.getByTestId('to'), {target: {value: '2018-12-01'}});

  // Click to get report
  const getReportButtonElement = screen.getByText(/Get report/i);
  userEvent.click(getReportButtonElement);

  // Wait for render report data
  await screen.findByText(/Name/i);

  // Check report data (O-Brand and it's value )
  expect(screen.getByText(/O-Brand/i)).toBeInTheDocument();
  expect(screen.getByText(/34563.51/i)).toBeInTheDocument();

});

/* Set 'from' and 'to' values for week */
test('Test report 1 by setting from and to values, for week', async () => {
  render(<App />);

  // Select first report
  const report1ButtonElement = screen.getByText(/Turnover per brand/i);
  userEvent.click(report1ButtonElement);

  // set from date
  await screen.findByTestId(/from/i);
  fireEvent.change(screen.getByTestId('from'), {target: {value: '2018-12-01'}});
  fireEvent.change(screen.getByTestId('to'), {target: {value: '2018-12-07'}});

  // Click to get report
  const getReportButtonElement = screen.getByText(/Get report/i);
  userEvent.click(getReportButtonElement);

  // Wait for render report data
  await screen.findByText(/Name/i);

  // Check report data (O-Brand & U-brand and it's value )
  expect(screen.getByText(/O-Brand/i)).toBeInTheDocument();
  expect(screen.getByText(/165856.46/i)).toBeInTheDocument();
  expect(screen.getByText(/U-Brand/i)).toBeInTheDocument();
  expect(screen.getByText(/113462.49/i)).toBeInTheDocument();

});

/* Set 'from' and 'to' values for 2 week */
test('Test report 1 by setting from and to values, for 2 week', async () => {
  render(<App />);

  // Select first report
  const report1ButtonElement = screen.getByText(/Turnover per brand/i);
  userEvent.click(report1ButtonElement);

  // set from date
  await screen.findByTestId(/from/i);
  fireEvent.change(screen.getByTestId('from'), {target: {value: '2018-12-01'}});
  fireEvent.change(screen.getByTestId('to'), {target: {value: '2018-12-14'}});

  // Click to get report
  const getReportButtonElement = screen.getByText(/Get report/i);
  userEvent.click(getReportButtonElement);

  // Wait for render report data
  await screen.findByText(/Name/i);

  // Check report data (O-Brand & U-brand and it's value )
  // Should be similar to same value as 7 days
  expect(screen.getByText(/O-Brand/i)).toBeInTheDocument();
  expect(screen.getByText(/165856.46/i)).toBeInTheDocument();
  expect(screen.getByText(/U-Brand/i)).toBeInTheDocument();
  expect(screen.getByText(/113462.49/i)).toBeInTheDocument();

});



/* Run tests for Report 2 */
test('Test report 2', async () => {
  render(<App />);

  // Select first report
  const report2ButtonElement = screen.getByText(/Turnover per day/i);
  userEvent.click(report2ButtonElement);

  // Check get report button rendered
  const getReportButtonElement = screen.getByText(/Get report/i);
  expect(getReportButtonElement).toBeInTheDocument();

  // set from date
  await screen.findByTestId(/from/i);
  fireEvent.change(screen.getByTestId('from'), {target: {value: '2018-01-01'}});

  // Click to get report
  userEvent.click(getReportButtonElement);

  // Wait for render report name
  await screen.findByText(/Turnover per day/i);

  // Wait for render report data
  await screen.findByText(/Date/i);

  // Check report data (O-Brand and it's value )
  expect(screen.getByText(/2018-01-01/i)).toBeInTheDocument();
  expect(screen.getByText(/10227.40/i)).toBeInTheDocument();

});

/* Set 'from' and 'to' values */
test('Test report 2 by setting from and to values to 2018-01-01', async () => {
  render(<App />);

  // Select report 2
  const report1ButtonElement = screen.getByText(/Turnover per day/i);
  userEvent.click(report1ButtonElement);

  // set from date
  await screen.findByTestId(/from/i);
  fireEvent.change(screen.getByTestId('from'), {target: {value: '2018-01-01'}});
  fireEvent.change(screen.getByTestId('to'), {target: {value: '2018-01-01'}});

  // Click to get report
  const getReportButtonElement = screen.getByText(/Get report/i);
  userEvent.click(getReportButtonElement);

  // Wait for render report name
  await screen.findByText(/Turnover per day/i);

  // Wait for render report data
  await screen.findByText(/Date/i);

  // Check report data (2018-01-01 and it's value )
  expect(screen.getByText(/2018-01-01/i)).toBeInTheDocument();
  expect(screen.getByText(/10227.40/i)).toBeInTheDocument();

});

/* Set 'from' and 'to' values for week */
test('Test report 2 by setting from and to values, for week', async () => {
  render(<App />);

  // Select report 2
  const report1ButtonElement = screen.getByText(/Turnover per day/i);
  userEvent.click(report1ButtonElement);

  // set from date
  await screen.findByTestId(/from/i);
  fireEvent.change(screen.getByTestId('from'), {target: {value: '2018-01-01'}});
  fireEvent.change(screen.getByTestId('to'), {target: {value: '2018-01-07'}});

  // Click to get report
  const getReportButtonElement = screen.getByText(/Get report/i);
  userEvent.click(getReportButtonElement);

  // Wait for render report name
  await screen.findByText(/Turnover per day/i);

  // Wait for render report data
  await screen.findByText(/Date/i);

  // Check report data
  expect(screen.getByText(/2018-01-01/i)).toBeInTheDocument();
  expect(screen.getByText(/10227.40/i)).toBeInTheDocument();
  expect(screen.getByText(/2018-01-07/i)).toBeInTheDocument();
  expect(screen.getByText(/33248.13/i)).toBeInTheDocument();

});

/* Set 'from' and 'to' values for 2 week */
test('Test report 2 by setting from and to values, for 2 week', async () => {
  render(<App />);

  // Select report 2
  const report1ButtonElement = screen.getByText(/Turnover per day/i);
  userEvent.click(report1ButtonElement);

  // set from date
  await screen.findByTestId(/from/i);
  fireEvent.change(screen.getByTestId('from'), {target: {value: '2018-01-01'}});
  fireEvent.change(screen.getByTestId('to'), {target: {value: '2018-01-14'}});

  // Click to get report
  const getReportButtonElement = screen.getByText(/Get report/i);
  userEvent.click(getReportButtonElement);

  // Wait for render report name
  await screen.findByText(/Turnover per day/i);

  // Wait for render report data
  await screen.findByText(/Date/i);

  // Check report data
  expect(screen.getByText(/2018-01-01/i)).toBeInTheDocument();
  expect(screen.getByText(/10227.40/i)).toBeInTheDocument();
  expect(screen.getByText(/2018-01-07/i)).toBeInTheDocument();
  expect(screen.getByText(/33248.13/i)).toBeInTheDocument();

});
