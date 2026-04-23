const API_BASE = 'http://localhost:3000';

document.addEventListener('DOMContentLoaded', () => {
  loadExpenses();
  populateCategories();

  document.getElementById('expense-form').addEventListener('submit', addExpense);
  document.getElementById('filter-category').addEventListener('change', loadExpenses);
  document.getElementById('sort-date').addEventListener('click', () => loadExpenses(true));
});

async function addExpense(event) {
  event.preventDefault();

  const submitButton = document.querySelector('button[type="submit"]');
  submitButton.disabled = true;
  submitButton.textContent = 'Adding...';

  const amount = parseFloat(document.getElementById('amount').value);
  const category = document.getElementById('category').value.trim();
  const description = document.getElementById('description').value.trim();
  const date = document.getElementById('date').value;

  if (!amount || !category || !date) {
    submitButton.disabled = false;
    submitButton.textContent = 'Add Expense';
    return;
  }

  const expense = { amount, category, description, date };

  try {
    const response = await fetch(`${API_BASE}/expenses`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(expense)
    });

    if (response.ok) {
      document.getElementById('expense-form').reset();
      loadExpenses();
      populateCategories();
    } else {
      const error = await response.json();
      alert(`Failed to add expense: ${error.error}`);
    }
  } catch (error) {
    console.error('Error adding expense:', error);
    alert('Error adding expense. Please try again.');
  } finally {
    submitButton.disabled = false;
    submitButton.textContent = 'Add Expense';
  }
}

async function loadExpenses(sortByDate = false) {
  const loading = document.getElementById('loading');
  loading.style.display = 'block';

  const category = document.getElementById('filter-category').value;
  let url = `${API_BASE}/expenses`;

  const params = new URLSearchParams();
  if (category) params.append('category', category);
  if (sortByDate) params.append('sort', 'date_desc');

  if (params.toString()) url += '?' + params.toString();

  try {
    const response = await fetch(url);
    const expenses = await response.json();

    displayExpenses(expenses);
    calculateTotal(expenses);
  } catch (error) {
    console.error('Error loading expenses:', error);
    alert('Error loading expenses. Please refresh the page.');
  } finally {
    loading.style.display = 'none';
  }
}

function displayExpenses(expenses) {
  const tbody = document.querySelector('#expenses-table tbody');
  tbody.innerHTML = '';

  expenses.forEach(expense => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${expense.date}</td>
      <td>₹${expense.amount.toFixed(2)}</td>
      <td>${expense.category}</td>
      <td>${expense.description || ''}</td>
    `;
    tbody.appendChild(row);
  });
}

function calculateTotal(expenses) {
  const total = expenses.reduce((sum, expense) => sum + expense.amount, 0);
  document.getElementById('total').textContent = `Total: ₹${total.toFixed(2)}`;
}

async function populateCategories() {
  try {
    const response = await fetch(`${API_BASE}/expenses`);
    const expenses = await response.json();

    const categories = [...new Set(expenses.map(e => e.category))];
    const select = document.getElementById('filter-category');

    // Clear existing options except "All Categories"
    select.innerHTML = '<option value="">All Categories</option>';

    categories.forEach(category => {
      const option = document.createElement('option');
      option.value = category;
      option.textContent = category;
      select.appendChild(option);
    });
  } catch (error) {
    console.error('Error populating categories:', error);
  }
}