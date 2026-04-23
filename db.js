const fs = require('fs');
const path = require('path');

const DB_FILE = path.join(__dirname, 'expenses.json');

// Ensure the file exists
if (!fs.existsSync(DB_FILE)) {
  fs.writeFileSync(DB_FILE, JSON.stringify([]));
}

function readExpenses() {
  try {
    const data = fs.readFileSync(DB_FILE, 'utf8');
    return JSON.parse(data);
  } catch (err) {
    console.error('Error reading expenses:', err);
    return [];
  }
}

function writeExpenses(expenses) {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(expenses, null, 2));
  } catch (err) {
    console.error('Error writing expenses:', err);
  }
}

module.exports = {
  getAll: readExpenses,
  add: (expense) => {
    const expenses = readExpenses();
    expenses.push(expense);
    writeExpenses(expenses);
  },
  filter: (category) => {
    const expenses = readExpenses();
    return category ? expenses.filter(e => e.category === category) : expenses;
  },
  sortByDateDesc: () => {
    const expenses = readExpenses();
    return expenses.sort((a, b) => new Date(b.date) - new Date(a.date));
  }
};