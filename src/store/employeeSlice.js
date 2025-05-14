import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { 
  getEmployees, 
  getEmployeeById, 
  createEmployee, 
  updateEmployee, 
  deleteEmployee 
} from '../services/employeeService';

// Async thunks for CRUD operations
export const fetchEmployees = createAsyncThunk(
  'employees/fetchEmployees',
  async (params, { rejectWithValue }) => {
    try {
      const response = await getEmployees(params);
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchEmployeeById = createAsyncThunk(
  'employees/fetchEmployeeById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await getEmployeeById(id);
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const addEmployee = createAsyncThunk(
  'employees/addEmployee',
  async (employeeData, { rejectWithValue }) => {
    try {
      const response = await createEmployee(employeeData);
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const modifyEmployee = createAsyncThunk(
  'employees/modifyEmployee',
  async (employeeData, { rejectWithValue }) => {
    try {
      const response = await updateEmployee(employeeData);
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const removeEmployee = createAsyncThunk(
  'employees/removeEmployee',
  async (id, { rejectWithValue }) => {
    try {
      await deleteEmployee(id);
      return id;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const initialState = {
  employees: [],
  currentEmployee: null,
  loading: false,
  error: null,
  totalCount: 0,
  departmentStats: {},
};

export const employeeSlice = createSlice({
  name: 'employees',
  initialState,
  reducers: {
    clearCurrentEmployee: (state) => {
      state.currentEmployee = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch all employees
      .addCase(fetchEmployees.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchEmployees.fulfilled, (state, action) => {
        state.loading = false;
        state.employees = action.payload.data || [];
        state.totalCount = action.payload.totalCount || 0;
        
        // Calculate department statistics
        const deptStats = {};
        state.employees.forEach(emp => {
          if (emp.department) {
            deptStats[emp.department] = (deptStats[emp.department] || 0) + 1;
          }
        });
        state.departmentStats = deptStats;
      })
      .addCase(fetchEmployees.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Fetch single employee
      .addCase(fetchEmployeeById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchEmployeeById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentEmployee = action.payload;
      })
      .addCase(fetchEmployeeById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Add new employee
      .addCase(addEmployee.fulfilled, (state, action) => {
        state.loading = false;
        state.employees.push(action.payload);
        state.totalCount += 1;
      })
      
      // Update employee
      .addCase(modifyEmployee.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.employees.findIndex(e => e.Id === action.payload.Id);
        if (index !== -1) {
          state.employees[index] = action.payload;
        }
      })
      
      // Delete employee
      .addCase(removeEmployee.fulfilled, (state, action) => {
        state.loading = false;
        state.employees = state.employees.filter(e => e.Id !== action.payload);
        state.totalCount -= 1;
      });
  },
});

export const { clearCurrentEmployee } = employeeSlice.actions;
export default employeeSlice.reducer;