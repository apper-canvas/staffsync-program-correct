// Employee data service using ApperClient for database operations

export async function getEmployees(options = {}) {
  try {
    const { ApperClient } = window.ApperSDK;
    const apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });

    const params = {
      Fields: [
        { Field: { Name: "Id" } },
        { Field: { Name: "Name" } },
        { Field: { Name: "firstName" } },
        { Field: { Name: "lastName" } },
        { Field: { Name: "email" } },
        { Field: { Name: "phone" } },
        { Field: { Name: "department" } },
        { Field: { Name: "position" } },
        { Field: { Name: "startDate" } },
        { Field: { Name: "employmentType" } },
        { Field: { Name: "photo" } }
      ],
      pagingInfo: {
        limit: options.limit || 20,
        offset: options.offset || 0
      }
    };

    // Add search filter if provided
    if (options.search) {
      params.whereGroups = [{
        operator: "OR",
        subGroups: [
          {
            conditions: [{
              FieldName: "firstName",
              operator: "Contains",
              values: [options.search]
            }],
            operator: ""
          },
          {
            conditions: [{
              FieldName: "lastName",
              operator: "Contains",
              values: [options.search]
            }],
            operator: ""
          },
          {
            conditions: [{
              FieldName: "email",
              operator: "Contains",
              values: [options.search]
            }],
            operator: ""
          }
        ]
      }];
    }

    // Add department filter if provided
    if (options.department) {
      if (!params.where) params.where = [];
      params.where.push({
        fieldName: "department",
        Operator: "ExactMatch",
        values: [options.department]
      });
    }

    // Add sorting if provided
    if (options.sortField) {
      params.orderBy = [{
        field: options.sortField,
        direction: options.sortOrder || "ASC"
      }];
    }

    const response = await apperClient.fetchRecords("employee", params);
    return {
      data: response.data || [],
      totalCount: response.totalCount || 0
    };
  } catch (error) {
    console.error("Error fetching employees:", error);
    throw error;
  }
}

export async function getEmployeeById(id) {
  try {
    const { ApperClient } = window.ApperSDK;
    const apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });

    const response = await apperClient.getRecordById("employee", id);
    return response.data;
  } catch (error) {
    console.error(`Error fetching employee with ID ${id}:`, error);
    throw error;
  }
}

export async function createEmployee(employeeData) {
  try {
    const { ApperClient } = window.ApperSDK;
    const apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });

    const response = await apperClient.createRecord("employee", { 
      record: employeeData 
    });
    return response.data;
  } catch (error) {
    console.error("Error creating employee:", error);
    throw error;
  }
}

export async function updateEmployee(employeeData) {
  try {
    const { ApperClient } = window.ApperSDK;
    const apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });

    const response = await apperClient.updateRecord("employee", { 
      record: employeeData 
    });
    return response.data;
  } catch (error) {
    console.error(`Error updating employee with ID ${employeeData.Id}:`, error);
    throw error;
  }
}

export async function deleteEmployee(id) {
  try {
    const { ApperClient } = window.ApperSDK;
    const apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });

    await apperClient.deleteRecord("employee", { 
      RecordIds: [id] 
    });
    return true;
  } catch (error) {
    console.error(`Error deleting employee with ID ${id}:`, error);
    throw error;
  }
}