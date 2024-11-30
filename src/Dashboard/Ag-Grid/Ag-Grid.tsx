import { createSignal, onMount, onCleanup } from 'solid-js';
import AgGridSolid from 'ag-grid-solid';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import './AgGrid.css';
import { updateData } from './store'; 

const UserList = () => {
  let gridApi;
  const [isEditing, setIsEditing] = createSignal(false);
  const [isAdding, setIsAdding] = createSignal(false);
  const [currentUser, setCurrentUser] = createSignal(null);

  // Signals for form fields
  const [Firstname, setFirstname] = createSignal('');
  const [Lastname, setLastname] = createSignal('');
  const [email, setEmail] = createSignal('');
  const [password, setPassword] = createSignal('');
  const [Gender, setGender] = createSignal('');
  const [Phone, setPhone] = createSignal('');
  const [alamat, setAlamat] = createSignal('');

  // Fetch user data from the backend
  const fetchUserData = async () => {
    try {
      const response = await fetch('http://127.0.0.1:8080/pengguna');
      if (!response.ok) {
        throw new Error('Failed to fetch user data');
      }
      const data = await response.json();
      console.log('Fetched data:', data); // Log the data to inspect its structure
      setRowData(data);

      // Update the store with gender and address data
      const genderData = data.reduce((acc, user) => {
        acc[user.gender] = (acc[user.gender] || 0) + 1;
        return acc;
      }, {});

      const addressData = data.reduce((acc, user) => {
        acc[user.alamat] = acc[user.alamat] ? acc[user.alamat] + 1 : 1;
        return acc;
      }, {});

      updateData(genderData, addressData);

    } catch (error) {
      console.error(error);
      alert('Failed to fetch user data');
    }
  };

  // Handle edit action
  const handleEdit = (user) => {
    console.log('Editing user:', user); // Log the user object to inspect its fields
    setIsEditing(true);
    setCurrentUser(user);
    setFirstname(user.firstname || '');
    setLastname(user.lastname || '');
    setEmail(user.email || '');
    setGender(user.gender || '');
    setPassword(user.hashed_password || ''); // Assuming the field name is 'hashed_password'
    setPhone(user.phone || '');
    setAlamat(user.alamat || '');
  };

  // Handle add action
  const handleAdd = () => {
    setIsAdding(true);
    // Reset form fields
    setFirstname('');
    setLastname('');
    setEmail('');
    setPassword('');
    setGender('');
    setPhone('');
    setAlamat('');
  };

  // Handle user update
  const handleUpdate = async () => {
    try {
      const updatedUser = {
        firstname: Firstname(),
        lastname: Lastname(),
        email: email(),
        gender: Gender(),
        password: password(),
        phone: Phone(),
        alamat: alamat(),
      };

      console.log('Sending request with data:', updatedUser);

      const response = await fetch(`http://127.0.0.1:8080/pengguna/update/${currentUser().id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedUser),
      });

      const textResponse = await response.text(); // Capture response as text for debugging
      console.log('Response:', textResponse);

      if (!response.ok) {
        throw new Error('Failed to update user');
      }

      fetchUserData();
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating user:', error.message);
      alert(`Error: ${error.message}`);
    }
  };

  // Handle user deletion
  const handleDelete = async (userId) => {
    try {
      const response = await fetch(`http://127.0.0.1:8080/delete/${userId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete user');
      }

      fetchUserData(); // Refresh the user list after deletion
    } catch (error) {
      console.error(error);
      alert('Failed to delete user');
    }
  };

  // Handle adding a new user
  const handleAddSubmit = async () => {
    try {
      const newUser = {
        firstname: Firstname(),
        lastname: Lastname(),
        email: email(),
        password: password(),
        gender: Gender(),
        phone: Phone(),
        alamat: alamat(),
      };

      console.log('Adding user with data:', newUser);

      const response = await fetch('http://127.0.0.1:8080/pengguna', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newUser),
      });

      if (!response.ok) {
        throw new Error('Failed to add user');
      }

      setIsAdding(false);
      fetchUserData(); // Refresh the user list after adding a new user
    } catch (error) {
      console.error('Error adding user:', error.message);
      alert(`Error: ${error.message}`);
    }
  };

  // Define column definitions for ag-Grid
  const columnDefs = [
    { headerName: 'First name', field: 'firstname', sortable: true, filter: true },
    { headerName: 'Last Name', field: 'lastname', sortable: true, filter: true },
    { headerName: 'Email', field: 'email', sortable: true, filter: true },
    { headerName: 'Gender', field: 'gender', sortable: true, filter: true },
    { headerName: 'Phone', field: 'phone', sortable: true, filter: true },
    { headerName: 'Alamat', field: 'alamat', sortable: true, filter: true },
    {
      headerName: 'Actions',
      cellRenderer: (params) => {
        const data = params.data;
        return (
          <div class="action-buttons">
            <button class="edit-button" onClick={() => handleEdit(data)}>
              Edit
            </button>
            <button class="delete-button" onClick={() => handleDelete(data.id)}>
              Delete
            </button>
          </div>
        );
      },
    },
  ];

  // Function to set gridApi
  const onGridReady = (params) => {
    gridApi = params.api;
    gridApi?.sizeColumnsToFit();
  };

  // Define row data using fetched data from the backend
  const [rowData, setRowData] = createSignal([]);

  // Fetch user data when the component mounts
  onMount(fetchUserData);

  // Cleanup function
  onCleanup(() => {
    // Cleanup code if needed
  });

  return (
    <div class="grid-form-container">
      <div class="button-container">
        <button class="add-button" onClick={handleAdd}>Add Data</button>
      </div>
      <div class="ag-theme-alpine" style={{ height: '200px', flex: 1 }}>
        <AgGridSolid
          columnDefs={columnDefs}
          rowData={rowData()}
          domLayout="autoHeight"
          onGridReady={onGridReady}
          defaultColDef={{
            flex: 1,
            minWidth: 150,
            resizable: true,
          }}
        />
      </div>
      {isEditing() && (
        <div class="edit-form">
          <h3>Edit User</h3>
          <label>
            First Name:
            <input type="text" value={Firstname()} onInput={(e) => setFirstname(e.target.value)} />
          </label>

          <label>
            Last Name:
            <input type="text" value={Lastname()} onInput={(e) => setLastname(e.target.value)} />
          </label>

          <label>
            Email:
            <input type="text" value={email()} onInput={(e) => setEmail(e.target.value)} />
          </label>

          <label>
            Gender:
            <input type="text" value={Gender()} onInput={(e) => setGender(e.target.value)} />
          </label>

          <label>
            Phone:
            <input type="text" value={Phone()} onInput={(e) => setPhone(e.target.value)} />
          </label>

          <label>
            Alamat:
            <input type="text" value={alamat()} onInput={(e) => setAlamat(e.target.value)} />
          </label>

          <button class="save-button" onClick={handleUpdate}>Save</button>
          <button class="cancel-button" onClick={() => setIsEditing(false)}>Cancel</button>
        </div>
      )}
      {isAdding() && (
        <div class="edit-form">
          <h3>Add User</h3>
          <label>
            First Name:
            <input type="text" value={Firstname()} onInput={(e) => setFirstname(e.target.value)} />
          </label>

          <label>
            Last Name:
            <input type="text" value={Lastname()} onInput={(e) => setLastname(e.target.value)} />
          </label>

          <label>
            Email:
            <input type="text" value={email()} onInput={(e) => setEmail(e.target.value)} />
          </label>

          <label>
            Password:
            <input type="text" value={password()} onInput={(e) => setPassword(e.target.value)} />
          </label>

          <label>
            Gender:
            <input type="text" value={Gender()} onInput={(e) => setGender(e.target.value)} />
          </label>

          <label>
            Phone:
            <input type="text" value={Phone()} onInput={(e) => setPhone(e.target.value)} />
          </label>

          <label>
            Alamat:
            <input type="text" value={alamat()} onInput={(e) => setAlamat(e.target.value)} />
          </label>

          <button class="save-button" onClick={handleAddSubmit}>Add</button>
          <button class="cancel-button" onClick={() => setIsAdding(false)}>Cancel</button>
        </div>
      )}
    </div>
  );
};

export default UserList;
