'use client'

import axios from "axios";

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

// const token = localStorage.getItem("accessToken");
// console.log('Serivcetoken',token);
// Function to get the token dynamically
const getAuthToken = async () => {
    if (typeof window !== "undefined") {
        return localStorage.getItem("authToken");
    }

    return null;
};


    //  {* COMPANY API *}
export async function getCompanyApi(){
    const token =await getAuthToken();

    console.log('token',token);
     
    const fullUrl = `${baseUrl}/v1/company/all`;

    try {
        const response = await axios.get(fullUrl, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: token,
            },
        });

        return response.data; 
    } catch (error) {
        console.error('Error fetching company data:', error);
        throw error;
    } 
}

export async function postCompanyApi(data){
    const token =await getAuthToken();
     
    const fullUrl = `${baseUrl}/v1/company/add`

    try {
        const response = await axios.post(fullUrl, data, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: token,
            },
        });

        return response.data; 
    } catch (error) {
        console.error('Error posting data:', error);
        throw error;
    }
}

export async function updateCompanyApi(data){
    const token =await getAuthToken();
     
    const fullUrl = `${baseUrl}/v1/company/update`

    try {
        const response = await axios.post(fullUrl, data, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: token,

            },
        });

        return response.data; 
    } catch (error) {
        console.error('Error posting data:', error);
        throw error;
    }
}
  


  //  {* BRANCH API *}
export async function getBranchApi(){
    const token =await getAuthToken();
     
    const fullUrl = `${baseUrl}/v1/branch/all`

    try {
        const response = await axios.get(fullUrl, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: token,

            },
        });

        return response.data; 
    } catch (error) {
        console.error('Error fetching Branch data:', error);
        throw error;
    } 
}


export async function postBranchApi(data){
    const token =await getAuthToken();
     
    const fullUrl = `${baseUrl}/v1/branch/add`

    try {
        const response = await axios.post(fullUrl, data, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: token,
            },
        });

        return response.data; 
    } catch (error) {
        console.error('Error posting data:', error);
        throw error;
    }
}

export async function updateBranchApi(data){
    const token =await getAuthToken();
     
    const fullUrl = `${baseUrl}/v1/branch/update`

    try {
        const response = await axios.post(fullUrl, data, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: token,
            },
        });

        return response.data; 
    } catch (error) {
        console.error('Error posting data:', error);
        throw error;
    }
}

export async function getBranchByCompanyApi(id){
    const token =await getAuthToken();
     
    const fullUrl = `${baseUrl}/v1/branch/getbranch/${id}`

    try {
        const response = await axios.get(fullUrl, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: token,
            },
        });

        return response.data; 
    } catch (error) {
        console.error('Error fetching Branch data:', error);
        throw error;
    }
}

export async function getParentBranchApi(id){
    const token =await getAuthToken();
     
    const fullUrl = `${baseUrl}/v1/branch/allparentbranch/${id}`

    try {
        const response = await axios.get(fullUrl, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: token,
            },
        });

        return response.data; 
    } catch (error) {
        console.error('Error fetching Branch data:', error);
        throw error;
    } 
}

//  {* IMAGE UPLOAD API *}

export async function uploadImageApi(file){
    const token = await getAuthToken();
     
    const fullUrl = `${baseUrl}/v1/api/file/upload`

    const payload = {
        image: file,
    }

    try {
        const response = await axios.post(fullUrl, payload, {
            headers: {
                'Content-Type': 'multipart/form-data',
                Authorization: token,
            },
        });

        return response.data; 
    } catch (error) {
        console.error('Error uploading image:', error);
        throw error;
    }
}
// Fixed API function to properly handle FormData
export async function uploadMultiImageApi(formData) {
  const token = await getAuthToken();
  const fullUrl = `${baseUrl}/v1/api/file/multi-mupload`;
  
  try {
    const response = await axios.post(fullUrl, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: token
      },
      // Add progress tracking
      onUploadProgress: (progressEvent) => {
        const percentCompleted = Math.round(
          (progressEvent.loaded * 100) / progressEvent.total
        );
        console.log(`Upload Progress: ${percentCompleted}%`);
      }
    });
    
    return response.data;
  } catch (error) {
    console.error('Error uploading images:', error);
    throw error;
  }
}
//  {* EMPLOYEE TYPE API *}

export async function getEmployeeTypeApi(){
    const token =await getAuthToken();
     
    const fullUrl = `${baseUrl}/v1/employeetype/all`

    try {
        const response = await axios.get(fullUrl, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: token,
            },
        });

        return response.data; 
    } catch (error) {
        console.error('Error fetching Employee Type data:', error);
        throw error;
    }
}

export async function postEmployeeTypeApi(data){
    const token =await getAuthToken();
     
    const fullUrl = `${baseUrl}/v1/employeetype/add`

    try {
        const response = await axios.post(fullUrl, data, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: token,
            },
        });

        return response.data; 
    } catch (error) {
        console.error('Error posting  Employee Type data:', error);
        throw error;
    }
}

export async function postEmployeeTypeUpdateApi(data){
    const token =await getAuthToken();
     
    const fullUrl = `${baseUrl}/v1/employeetype/update`
    
    try {
        const response = await axios.post(fullUrl, data, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: token,
            },
        });

        return response.data; 
    } catch (error) {
        console.error('Error Updating  Employee Type data:', error);
        throw error;
    }
}


export async function getEmployeeTypeByCompanyApi(id){
    const token =await getAuthToken();
     
    const fullUrl = `${baseUrl}/v1/employeetype/getemptypewithcompany/${id}`

    try {
        const response = await axios.get(fullUrl, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: token,
            },
        });

        return response.data; 
    } catch (error) {
        console.error('Error fetching Branch data:', error);
        throw error;
    }
}


export async function getEmployeeTypeByIdApi(id){
    const token =await getAuthToken();
     
    const fullUrl = `${baseUrl}/v1/employeetype/getemptype/${id}`

    try {
        const response = await axios.get(fullUrl, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: token,
            },
        });

        return response.data; 
    } catch (error) {
        console.error('Error fetching Employee Type data:', error);
        throw error;
    }
}

  //  {* EMPLOYEEMENT TYPE API *}
export async function getEmployementTypeApi(){
    const token =await getAuthToken();
     
    const fullUrl = `${baseUrl}/v1/employement/all`

    try {
        const response = await axios.get(fullUrl, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: token,
            },
        });

        return response.data; 
    } catch (error) {
        console.error('Error fetching Employement  data:', error);
        throw error;
    }
}

export async function postEmployementApi(data){
    const token =await getAuthToken();
     
    const fullUrl = `${baseUrl}/v1/employement/add`

    try {
        const response = await axios.post(fullUrl, data, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: token,
            },
        });

        return response.data; 
    } catch (error) {
        console.error('Error posting  Employement Type data:', error);
        throw error;
    }
}

export async function postEmployeeMentTypeUpdateApi(data){
    const token =await getAuthToken();
     
    const fullUrl = `${baseUrl}/v1/employement/update`

    try {
        const response = await axios.post(fullUrl, data, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: token,
            },
        });

        return response.data; 
    } catch (error) {
        console.error('Error Updating  Employeement Type data:', error);
        throw error;
    }
}


export async function getEmployeementTypeByCompanyApi(id){
    const token =await getAuthToken();
     
    const fullUrl = `${baseUrl}/v1/employement/getemptypewithcompany/${id}`

    try {
        const response = await axios.get(fullUrl, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: token,
            },
        });

        return response.data; 
    } catch (error) {
        console.error('Error fetching Branch data:', error);
        throw error;
    }
}


export async function getEmployeementTypeByIdApi(id){
    const token =await getAuthToken();
     
    const fullUrl = `${baseUrl}/v1/employement/getemptype/${id}`

    try {
        const response = await axios.get(fullUrl, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: token,
            },
        });

        return response.data; 
    } catch (error) {
        console.error('Error fetching Employeement Type data:', error);
        throw error;
    }
}


  //  {* DEPARTMENT API *}
export async function getDepartmentApi(){
    const token =await getAuthToken();
     
    const fullUrl = `${baseUrl}/v1/department/all`

    try {
        const response = await axios.get(fullUrl, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: token,
            },
        });

        return response.data; 
    } catch (error) {
        console.error('Error fetching Department data:', error);
        throw error;
    } 
}

export async function postDepartmentApi(data){
    const token =await getAuthToken();
     
    const fullUrl = `${baseUrl}/v1/department/add`

    try {
        const response = await axios.post(fullUrl, data, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: token,
            },
        });

        return response.data; 
    } catch (error) {
        console.error('Error posting data:', error);
        throw error;
    }
}

export async function postDepartmentUpdateApi(data){
    const token =await getAuthToken();
     
    const fullUrl = `${baseUrl}/v1/department/update`

    try {
        const response = await axios.post(fullUrl, data, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: token,
            },
        });

        return response.data; 
    } catch (error) {
        console.error('Error posting data:', error);
        throw error;    
    }
}

export async function getDepartmentByBranchApi(id){
    const token =await getAuthToken();
     
    const fullUrl = `${baseUrl}/v1/department/getdepartment/${id}`

    try {
        const response = await axios.get(fullUrl, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: token,
            },
        });

        return response.data; 
    } catch (error) {
        console.error('Error fetching Branch data:', error);
        throw error;
    }
}

  //  {* Designation API *}
export async function getDesignationApi(){
    const token =await getAuthToken();
     
    const fullUrl = `${baseUrl}/v1/designation/all`

    try {
        const response = await axios.get(fullUrl, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: token,
            },
        });

        return response.data; 
    } catch (error) {
        console.error('Error fetching Department data:', error);
        throw error;
    } 
}


export async function postDesignationApi(data){
    const token =await getAuthToken();
     
    const fullUrl = `${baseUrl}/v1/designation/add`

    try {
        const response = await axios.post(fullUrl, data, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: token,

            },
        });

        return response.data; 
    } catch (error) {
        console.error('Error posting data:', error);
        throw error;
    }
}


export async function UpdateDesignationApi(data){
    const token =await getAuthToken();
     
    const fullUrl = `${baseUrl}/v1/designation/update`

    try {
        const response = await axios.post(fullUrl, data, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: token,
            },
        });

        return response.data; 
    } catch (error) {
        console.error('Error posting data:', error);
        throw error;
    }
}

export async function getDesignationByDepartmentApi(id){
    const token =await getAuthToken();
     
    const fullUrl = `${baseUrl}/v1/designation/getdesignation/${id}`

    try {
        const response = await axios.get(fullUrl, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: token,
            },
        });

        return response.data; 
    } catch (error) {
        console.error('Error fetching Branch data:', error);
        throw error;
    }
}

  //  {* GRADE API *}
export async function getGradeApi(){
    const token =await getAuthToken();
     
    const fullUrl = `${baseUrl}/v1/grade/all`

    try {
        const response = await axios.get(fullUrl, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: token,

            },
        });

        return response.data; 
    } catch (error) {
        console.error('Error fetching Department data:', error);
        throw error;
    } 
}

export async function postGradeApi(data){
    const token = await getAuthToken();
     
    const fullUrl = `${baseUrl}/v1/grade/add`

    try {
        const response = await axios.post(fullUrl, data, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: token,

            },
        });

        return response.data; 
    } catch (error) {
        console.error('Error posting data:', error);
        throw error;
    }
}


export async function getAllJobApi(){
    const token = await getAuthToken();
     
    const fullUrl = `${baseUrl}/v1/job/getMyJob`

    try {
        const response = await axios.get(fullUrl, {
            headers: {
                'Content-Type': 'application/json',

                Authorization: token,
            },
        });

        return response.data; 
    } catch (error) {
        console.error('Error fetching Job data:', error);
        throw error;
    }
}

export async function getJobApi(){
    const token = await getAuthToken();
     
    const fullUrl = `${baseUrl}/v1/job/all`

    try {
        const response = await axios.get(fullUrl, {
            headers: {
                'Content-Type': 'application/json',

                Authorization: token,
            },
        });

        return response.data; 
    } catch (error) {
        console.error('Error fetching Job data:', error);
        throw error;
    }
}

export async function getMyJobApi(id){
    const token = await getAuthToken();
     
    const fullUrl = `${baseUrl}/v1/job/getMyJob?stageId=${id}`;
    
    // const fullUrl = id ? `${baseUrl}/v1/job/getMyJob?stageId=${id}` 
    // : `${baseUrl}/v1/job/getMyJob`;

    try {
        const response = await axios.get(fullUrl, {
            headers: {
                'Content-Type': 'application/json',

                Authorization: token,
            },
        });

        return response.data; 
    } catch (error) {
        console.error('Error fetching Job data:', error);
        throw error;
    }
}

export async function getAcceptedJobApi(id){
    const token = await getAuthToken();
     
    const fullUrl = `${baseUrl}/v1/job/getMyAcceptedJob?stageId=${id}`;
    
    // const fullUrl = id ? `${baseUrl}/v1/job/getMyJob?stageId=${id}` 
    // : `${baseUrl}/v1/job/getMyJob`;

    try {
        const response = await axios.get(fullUrl, {
            headers: {
                'Content-Type': 'application/json',

                Authorization: token,
            },
        });

        return response.data; 
    } catch (error) {
        console.error('Error fetching Job data:', error);
        throw error;
    }
}

export async function getAllocatedJobApi(){
    const token = await getAuthToken();
     
    const fullUrl = `${baseUrl}/v1/job/allocatedjob`;
    
    // const fullUrl = id ? `${baseUrl}/v1/job/getMyJob?stageId=${id}` 
    // : `${baseUrl}/v1/job/getMyJob`;

    try {
        const response = await axios.get(fullUrl, {
            headers: {
                'Content-Type': 'application/json',

                Authorization: token,
            },
        });

        return response.data; 
    } catch (error) {
        console.error('Error fetching Job data:', error);
        throw error;
    }
}

export async function getPendingJobApi(id){
    const token = await getAuthToken();
     
    const fullUrl = `${baseUrl}/v1/job/getMyPendingJob?stageId=${id}`;
    
    // const fullUrl = id ? `${baseUrl}/v1/job/getMyJob?stageId=${id}` 
    // : `${baseUrl}/v1/job/getMyJob`;

    try {
        const response = await axios.get(fullUrl, {
            headers: {
                'Content-Type': 'application/json',

                Authorization: token,
            },
        });

        return response.data; 
    } catch (error) {
        console.error('Error fetching Job data:', error);
        throw error;
    }
}

export async function postJobApi (data){
    const token = await getAuthToken();
     
    const fullUrl = `${baseUrl}/v1/job/add`

    try {
        const response = await axios.post(fullUrl, data, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: token,

            },
        });

        return response.data; 
    } catch (error) {
        console.error('Error posting  Job data:', error);
        throw error;
    }
}

export async function uploadExcelAPI (data){
    const token = await getAuthToken();
     
    const fullUrl = `${baseUrl}/v1/job/addjobbyexcel`

    try {
        const response = await axios.post(fullUrl, data, {
            headers: {
                'Content-Type':  'multipart/form-data',
                Authorization: token,

            },
        });

        return response.data; 
    } catch (error) {
        console.error('Error posting  Job data:', error);
        throw error;
    }
}

export async function getSampleExcelAPI (id){
    const token = await getAuthToken();
     
    const fullUrl = `${baseUrl}/v1/job/getsamplesheet?partnerId=${id}`

    try {
        const response = await axios.get(fullUrl, {
            headers: {
                'Content-Type':  'application/json',
                Authorization: token,

            },
        });

        return response.data; 
    } catch (error) {
        console.error('Error posting  Job data:', error);
        throw error;
    }
}

export async function updateEmpJobApi (data){
    const token = await getAuthToken();
     
    const fullUrl = `${baseUrl}/v1/job/updatemyjob`

    try {
        const response = await axios.post(fullUrl, data, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: token,

            },
        });

        return response.data; 
    } catch (error) {
        console.error('Error posting  Job data:', error);
        throw error;
    }
}

export async function reallocateEmpJobApi (data){
    const token = await getAuthToken();
     
    const fullUrl = `${baseUrl}/v1/job/reallocate`

    try {
        const response = await axios.post(fullUrl, data, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: token,

            },
        });

        return response.data; 
    } catch (error) {
        console.error('Error posting  Job data:', error);
        throw error;
    }
}

export async function acceptEmpJobApi (data){
    const token = await getAuthToken();
     
    const fullUrl = `${baseUrl}/v1/job/acceptEmpJob`

    try {
        const response = await axios.post(fullUrl, data, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: token,

            },
        });

        return response.data; 
    } catch (error) {
        console.error('Error posting  Job data:', error);
        throw error;
    }
}

export async function postJobUpdateApi(data){
    const token =await getAuthToken();
     
    const fullUrl = `${baseUrl}/v1/job/update`

    try {
        const response = await axios.post(fullUrl, data, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: token,

            },
        });

        return response.data; 
    } catch (error) {
        console.error('Error Updating Job data:', error);
        throw error;
    }
}

export async function getJobByIdApi(id){
    const token =await getAuthToken();
     
    const fullUrl = `${baseUrl}/v1/job/get/${id}`

    try {
        const response = await axios.get(fullUrl, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: token,

            },
        });

        return response.data; 
    } catch (error) {
        console.error('Error fetching Job data:', error);
        throw error;
    }
}

export async function getEmpJobApi(){
    const token =await getAuthToken();
     
    const fullUrl = `${baseUrl}/v1/job/getEmpJob`

    try {
        const response = await axios.get(fullUrl, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: token,

            },
        });

        return response.data; 
    } catch (error) {
        console.error('Error fetching Job data:', error);
        throw error;
    }
}

export async function getEmpCompletedJobApi(){
    const token =await getAuthToken();
     
    const fullUrl = `${baseUrl}/v1/job/getempcompletedJob`

    try {
        const response = await axios.get(fullUrl, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: token,

            },
        });

        return response.data; 
    } catch (error) {
        console.error('Error fetching Job data:', error);
        throw error;
    }
}

export async function getEmpPendingJobApi(){
    const token =await getAuthToken();
     
    const fullUrl = `${baseUrl}/v1/job/getEmpPendingJob`

    try {
        const response = await axios.get(fullUrl, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: token,

            },
        });

        return response.data; 
    } catch (error) {
        console.error('Error fetching Job data:', error);
        throw error;
    }
}

export async function postAllocationApi (data){
    const token =await getAuthToken();
     
    const fullUrl = `${baseUrl}/v1/job/allocate`

    try {
        const response = await axios.post(fullUrl, data, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: token,

            },
        });

        return response.data; 
    } catch (error) {
        console.error('Error posting  Job data:', error);
        throw error;
    }
}

export async function acceptAllocationApi (data){
    const token =await getAuthToken();
     
    const fullUrl = `${baseUrl}/v1/job/acceptallocation`

    try {
        const response = await axios.post(fullUrl, data, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: token,

            },
        });

        return response.data; 
    } catch (error) {
        console.error('Error posting  Job data:', error);
        throw error;
    }
}

export async function postBackOfficeApi (data){
    const token =await getAuthToken();
     
    const fullUrl = `${baseUrl}/v1/job/update`

    try {
        const response = await axios.post(fullUrl, data, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: token,

            },
        });

        return response.data; 
    } catch (error) {
        console.error('Error posting  Job data:', error);
        throw error;
    }
}

export async function postFinalJobUpdateAPI (data){
    const token =await getAuthToken();
     
    const fullUrl = `${baseUrl}/v1/job/updatesatge`

    try {
        const response = await axios.post(fullUrl, data, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: token,

            },
        });

        return response.data; 
    } catch (error) {
        console.error('Error posting  Job data:', error);
        throw error;
    }
}

export async function updateGradeApi(data){
    const token =await getAuthToken();
     
    const fullUrl = `${baseUrl}/v1/grade/update`

    try {
        const response = await axios.post(fullUrl, data, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: token,

            },
        });

        return response.data; 
    } catch (error) {
        console.error('Error posting data:', error);
        throw error;
    }
}


   {/* EMPLOYEE SETUP API */}

export async function getAllEmployeeApi(){
    const token =await getAuthToken();
    console.log('token',token);
     
    const fullUrl = `${baseUrl}/v1/api/Auth/getAllEmployee`

    try {
        const response = await axios.get(fullUrl, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: token,

            },
        });

        return response.data; 
    } catch (error) {
        console.error('Error fetching All Employee data:', error);
        throw error;
    }
}

export async function getAllRelevantEmployeeApi(locationId){
    const token =await getAuthToken();
     
    const fullUrl = `${baseUrl}/v1/employee/allRelevent?locationId=${locationId}`

    try {
        const response = await axios.get(fullUrl, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: token,

            },
        });

        return response.data; 
    } catch (error) {
        console.error('Error fetching All Employee data:', error);
        throw error;
    }
}

export async function postEmployeeApi(data){
    const token =await getAuthToken()
     
    const fullUrl = `${baseUrl}/v1/employee/add`

    try {
        const response = await axios.post(fullUrl, data, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: token,

            },
        });

        return response.data; 
    } catch (error) {
        console.error('Error posting data:', error);
        throw error;
    }
}

export async function getEmployeeByIdApi(id){
    const token =await getAuthToken();
     
    const fullUrl = `${baseUrl}/v1/employee/get/${id}`

    try {
        const response = await axios.get(fullUrl, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: token,

            },
        });

        return response.data; 
    } catch (error) {
        console.error('Error fetching Department data:', error);
        throw error;
    }
}

export async function updateEmployeeApi(data){
    const token =await getAuthToken();
     
    const fullUrl = `${baseUrl}/v1/employee/update`

    try {
        const response = await axios.post(fullUrl, data, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: token,

            },
        });

        return response.data; 
    } catch (error) {
        console.error('Error posting data:', error);
        throw error;
    }
}

export async function updateProfileEmployeeApi(data){
    const token =await getAuthToken();
     
    const fullUrl = `${baseUrl}/v1/employee/update-profile`

    try {
        const response = await axios.post(fullUrl, data, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: token,

            },
        });

        return response.data; 
    } catch (error) {
        console.error('Error posting data:', error);
        throw error;
    }
}


export async function getJobStageApi(stage){
    const token =await getAuthToken();
     
    const fullUrl = `${baseUrl}/v1/job/all?stageId=${stage}`
    
    try {
        const response = await axios.get(fullUrl, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: token,

            },
        });

        return response.data; 
    } catch (error) {
        console.error('Error fetching Job data:', error);
        throw error;
    }
}

export async function getFinalJobeApi(stage){
    const token =await getAuthToken();
     
    const fullUrl = `${baseUrl}/v1/job/getfinaljob`
    
    try {
        const response = await axios.get(fullUrl, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: token,

            },
        });

        return response.data; 
    } catch (error) {
        console.error('Error fetching Job data:', error);
        throw error;
    }
}

export async function getRoleApi(){
    const token =await getAuthToken();
     
    const fullUrl = `${baseUrl}/v1/role/allbyid`

    try {
        const response = await axios.get(fullUrl, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: token,

            },
        });

        return response.data; 
    } catch (error) {
        console.error('Error fetching role data:', error);
        throw error;
    }
}

// export async function getRoleByIdApi(id){
//     const token =await getAuthToken();
     
//     const fullUrl = `${baseUrl}/v1/role/get?${id}`

//     try {
//         const response = await axios.get(fullUrl, {
//             headers: {
//                 'Content-Type': 'application/json',
//                 Authorization: token,

//             },
//         });

//         return response.data; 
//     } catch (error) {
//         console.error('Error fetching role data:', error);
//         throw error;
//     }
// }

export async function postRoleApi (data){
    const token =await getAuthToken();
     
    const fullUrl = `${baseUrl}/v1/role/add`

    try {
        const response = await axios.post(fullUrl, data, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: token,

            },
        });

        return response.data; 
    } catch (error) {
        console.error('Error posting  role data:', error);
        throw error;
    }
}

export async function postRoleUpdateApi(data){
    const token =await getAuthToken();
     
    const fullUrl = `${baseUrl}/v1/role/update`

    try {
        const response = await axios.post(fullUrl, data, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: token,

            },
        });

        return response.data; 
    } catch (error) {
        console.error('Error Updating role data:', error);
        throw error;
    }
}

export async function getRoleByIdApi(id){
    const token =await getAuthToken();
     
    const fullUrl = `${baseUrl}/v1/role/get/${id}`

    try {
        const response = await axios.get(fullUrl, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: token,

            },
        });

        return response.data; 
    } catch (error) {
        console.error('Error fetching role data:', error);
        throw error;
    }
}





    {/* LOGIN API */}

export async function LoginApi(data){
    // const token =await getAuthToken();
     
    const fullUrl = `${baseUrl}/v1/auth/login`

    try {
        const response = await axios.post(fullUrl, data, {
            headers: {
                'Content-Type': 'application/json',

                // Authorization: token,
            },
        });

        return response.data;
        
    } catch (error) {
        console.error('Error fetching Department data:', error);
        throw error;
    }
}


    {/* USER API */}

export async function getAllUserApi(){
    const token =await getAuthToken();
    const fullUrl = `${baseUrl}/v1/api/request/finduser`

    try {
        const response = await axios.get(fullUrl, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: token,

            },
        });

        return response.data; 
    } catch (error) {
        console.error('Error fetching User data:', error);
        throw error;
    }
}



    { /* PARTNER API */}

export async function sendRequestApi(data){
    const token =await getAuthToken();
    const fullUrl = `${baseUrl}/v1/request/send`

    try {
        const response = await axios.post(fullUrl,data, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: token,

            },
        });

        return response.data; 
    } catch (error) {
        console.error('Error fetching Partner data:', error);
        throw error;
    }
}

export async function AddClientApi(data){
    const token =await getAuthToken();
    const fullUrl = `${baseUrl}/v1/api/request/createclient`

    try {
        const response = await axios.post(fullUrl,data, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: token,

            },
        });

        return response.data; 
    } catch (error) {
        console.error('Error fetching Partner data:', error);
        throw error;
    }
}


export async function getReqSendAPI(status){
    const token =await getAuthToken();
    const fullUrl = `${baseUrl}/v1/request/getsend?status=${status}`

    try {
        const response = await axios.get(fullUrl, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: token,

            },
        });

        return response.data; 
    } catch (error) {
        console.error('Error fetching Partner data:', error);
        throw error;
    }
}


export async function getReceivedReqAPI(status){
    const token =await getAuthToken();
    const fullUrl = `${baseUrl}/v1/request/getreceived?${status}`

    try {
        const response = await axios.get(fullUrl, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: token,

            },
        });

        return response.data; 
    } catch (error) {
        console.error('Error fetching Partner data:', error);
        throw error;
    }
}


export async function getMyPartnersAPI(){
    const token = await getAuthToken();
    const fullUrl = `${baseUrl}/v1/api/request/mypartners`

    try {
        const response = await axios.get(fullUrl, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: token,

            },
        });

        return response.data; 
    } catch (error) {
        console.error('Error fetching Partner data:', error);
        throw error;
    }
}



export async function receivedReqStatusUpdateApi(id,status){
    const token =await getAuthToken();
    const fullUrl = `${baseUrl}/v1/request/update`

    const payload = {
        id:id,
        status: status
    }

    try {
        const response = await axios.post(fullUrl, payload, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: token,

            },
        });

        return response.data; 
    } catch (error) {
        console.error('Error fetching Partner data:', error);
        throw error;
    }
}

{/* Product */}

export async function getPartnerProductByIdAPI(){
    const token = await getAuthToken();
    
     // Set the correct URL based on userType
    //  const fullUrl = userType === 'client'
    //  ? `${baseUrl}/v1/job/getpartnerproduct?partnerId=${id}`
    //  : `${baseUrl}/v1/job/getpartnerproduct`;

    const fullUrl = `${baseUrl}/v1/job/getpartnerproduct`;

    try {
        const res = await axios.get(fullUrl , {
            headers: {
                'Content-Type': 'application/json',
                Authorization: token,
            }
        });

        return res.data
    } catch (error) {
        console.error( 'Error fetching Products', error)
        throw error;
    }
}

export async function getAllUserProductsAPI(){

    const token = await getAuthToken();
    const fullUrl = `${baseUrl}/v1/api/userproduct/all`

    try {
        const res = await axios.get(fullUrl , {
            headers: {
                'Content-Type': 'application/json',
                Authorization: token,

            },
        })

        return res.data
    } catch (error) {
        console.error( 'Error fetching Products', error)
        throw error;
    }
} 


export async function AddProductAPI(data){

    const token = await getAuthToken();
    const fullUrl = `${baseUrl}/v1/userproduct/add`

    try {
        const res = await axios.post(fullUrl , data, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: token,
            },
        })

        return res.data
    } catch (error) {
        console.error( 'Error fetching Products', error)
        throw error;
    }
} 

export async function RemoveProductAPI(data){

    const token = await getAuthToken();
    const fullUrl = `${baseUrl}/v1/userproduct/remove`;

    const payload = {
        productId: data
    }

    try {
        const res = await axios.post(fullUrl , payload, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: token,
            },
        })

        return res.data
    } catch (error) {
        console.error( 'Error fetching Products', error)
        throw error;
    }
} 

export async function UpdateProductAPI(data){

    const token = await getAuthToken();
    const fullUrl = `${baseUrl}/v1/userproduct/update`

    try {
        const res = await axios.post(fullUrl , data, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: token,
            },
        })

        return res.data
    } catch (error) {
        console.error( 'Error fetching Products', error)
        throw error;
    }
} 

export async function UpdatePartnerProductAPI(data){

    const token = await getAuthToken();
    const fullUrl = `${baseUrl}/v1/api/request/updatepartnerdata`

    try {
        const res = await axios.post(fullUrl , data, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: token,
            },
        })

        return res.data
    } catch (error) {
        console.error( 'Error fetching Products', error)
        throw error;
    }
} 


export async function getAllFormAPI(){

    const token = await getAuthToken();
    const fullUrl = `${baseUrl}/v1/api/form/all`

    try {
        const res = await axios.get(fullUrl , {
            headers: {
                'Content-Type': 'application/json',
                Authorization: token,

            },
        })

        return res.data
    } catch (error) {
        console.error( 'Error fetching Products', error)
        throw error;
    }

} 

export async function addAllDocAPI(data){

    const token = await getAuthToken();
    const fullUrl = `${baseUrl}/v1/api/doc/add`

    try {
        const res = await axios.post(fullUrl ,data, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: token,
            },
        })

        return res.data
    } catch (error) {
        console.error( 'Error fetching Products', error)
        throw error;
    }
} 
export async function getAllDocAPI(id){

    const token = await getAuthToken();
    const fullUrl = `${baseUrl}/v1/api/doc/all?reportId=${id}`

    try {
        const res = await axios.get(fullUrl , {
            headers: {
                'Content-Type': 'application/json',
                Authorization: token,
            },
        })

        return res.data
    } catch (error) {
        console.error( 'Error fetching Products', error)
        throw error;
    }
} 
export async function removeAllDocAPI(id){

    const token = await getAuthToken();
    const fullUrl = `${baseUrl}/v1/api/doc/remove?id=${id}`

    try {
        const res = await axios.get(fullUrl , {
            headers: {
                'Content-Type': 'application/json',
                Authorization: token,
            },
        })

        return res.data
    } catch (error) {
        console.error( 'Error fetching Products', error)
        throw error;
    }
} 

{/* Product Library */}

export async function getAllProductsLibraryAPI(){

    const token = await getAuthToken();
    const fullUrl = `${baseUrl}/v1/product/all?status=approve`

    try {
        const res = await axios.get(fullUrl , {
            headers: {
                'Content-Type': 'application/json',
                Authorization: token,

            },
        })

        return res.data
    } catch (error) {
        console.error( 'Error fetching Products', error)
        throw error;
    }

} 

export async function getAllUnselectedProductsAPI(){
    const token = await getAuthToken();
    const fullUrl = `${baseUrl}/v1/userproduct/allunselect`

    try {
        const res = await axios.get(fullUrl , {
            headers: {
                'Content-Type': 'application/json',
                Authorization: token,

            },
        })

        return res.data
    } catch (error) {
        console.error( 'Error fetching Products', error)
        throw error;
    }

} 

export async function getAllProductsAPI(){
    const token = await getAuthToken();
    const fullUrl = `${baseUrl}/v1/api/userproduct/all`

    try {
        const res = await axios.get(fullUrl , {
            headers: {
                'Content-Type': 'application/json',
                Authorization: token,

            },
        })

        return res.data
    } catch (error) {
        console.error( 'Error fetching Products', error)
        throw error;
    }

} 

export async function getAllRemainingProductsAPI(id){
    const token = await getAuthToken();
    const fullUrl = `${baseUrl}/v1/request/getuncheckedproduct?id=${id}`

    try {
        const res = await axios.get(fullUrl , {
            headers: {
                'Content-Type': 'application/json',
                Authorization: token,

            },
        })

        return res.data
    } catch (error) {
        console.error( 'Error fetching Products', error)
        throw error;
    }

} 

export async function getPartnerDetailsAPI(id){
    const token = await getAuthToken();
    const fullUrl = `${baseUrl}/v1/api/request/partnerdetails?requestId=${id}`

    try {
        const res = await axios.get(fullUrl , {
            headers: {
                'Content-Type': 'application/json',
                Authorization: token,

            },
        })

        return res.data
    } catch (error) {
        console.error( 'Error fetching Products', error)
        throw error;
    }
} 

export async function getPartnerProductsAPI(id){
    const token = await getAuthToken();
    const fullUrl = `${baseUrl}/v1/api/userproduct/all?requestId=${id}`

    try {
        const res = await axios.get(fullUrl , {
            headers: {
                'Content-Type': 'application/json',
                Authorization: token,

            },
        })

        return res.data
    } catch (error) {
        console.error( 'Error fetching Products', error)
        throw error;
    }
} 
export async function getAllFormProductsAPI(id){
    const token = await getAuthToken();
    const fullUrl = `${baseUrl}/v1/api/request/getFormByProduct?requestId=${id}`

    try {
        const res = await axios.get(fullUrl , {
            headers: {
                'Content-Type': 'application/json',
                Authorization: token,
            },
        })

        return res.data
    } catch (error) {
        console.error( 'Error fetching Products', error)
        throw error;
    }
} 

export async function getCheckedProductAPI(reqId,productId){
    const token = await getAuthToken();
    const fullUrl = `${baseUrl}/v1/request/inactiveproduct?requestId=${reqId}&userProductId=${productId}`

    try {
        const res = await axios.get(fullUrl , {
            headers: {
                'Content-Type': 'application/json',
                Authorization: token,

            },
        })

        return res.data
    } catch (error) {
        console.error( 'Error fetching Products', error)
        throw error;
    }
} 

// {Locations}

export async function getAllLocationsAPI(id){
    const token = await getAuthToken();
    const fullUrl = `${baseUrl}/v1/api/location/all?partnerId=${id}`

    try {
        const res = await axios.get(fullUrl , {
            headers: {
                'Content-Type': 'application/json',
                Authorization: token,

            },
        })

        return res.data
    } catch (error) {
        console.error( 'Error fetching Locations', error)
        throw error;
    }
}

export async function addLocationsAPI(data){
    const token = await getAuthToken();
    const fullUrl = `${baseUrl}/v1/location/create`

    try {
        const res = await axios.post(fullUrl ,data, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: token,

            },
        })

        return res.data
    } catch (error) {
        console.error( 'Error fetching Locations', error)
        throw error;
    }
}

export async function updateLocationsAPI(data){
    const token = await getAuthToken();
    const fullUrl = `${baseUrl}/v1/location/update`

    try {
        const res = await axios.post(fullUrl ,data, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: token,

            },
        })

        return res.data
    } catch (error) {
        console.error( 'Error fetching Locations', error)
        throw error;
    }
}

export async function fetchPartnerDetailsAPI(id) {
    const token = await getAuthToken();
    const fullUrl = `${baseUrl}/v1/api/request/getpartner/${id}`;
    try {
        const res = await axios.get(fullUrl, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: token,
            },
        });
        return res.data;
    } catch (error) {
        console.error('Error fetching partner details', error);
        throw error;
    }
}

export async function updatePartnerDetailsAPI(data) {
    const token = await getAuthToken();
    const fullUrl = `${baseUrl}/v1/api/request/updatepartner`;
    try {
        const res = await axios.post(fullUrl,data, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: token,
            },
        });
        return res.data;
    } catch (error) {
        console.error('Error fetching partner details', error);
        throw error;
    }
}

    {/* Variables */}

    
export async function addVariablesAPI(data){
    const token = await getAuthToken();
    const fullUrl = `${baseUrl}/v1/api/variable/add`

    try {
        const res = await axios.post(fullUrl ,data, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: token,

            },
        })

        return res.data
    } catch (error) {
        console.error( 'Error fetching variables', error)
        throw error;
    }
}
    
export async function updateVariablesAPI(data){
    const token = await getAuthToken();
    const fullUrl = `${baseUrl}/v1/api/variable/update`

    try {
        const res = await axios.post(fullUrl ,data, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: token,

            },
        })

        return res.data
    } catch (error) {
        console.error( 'Error fetching variables', error)
        throw error;
    }
}
    
export async function deleteVariablesAPI(varId) {
    const token = await getAuthToken();
    const fullUrl = `${baseUrl}/v1/api/variable/remove`;

    try {
        const res = await axios.get(fullUrl, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: token,
            },
            params: { varId } // Send varId as a query parameter
        });

        return res.data;
    } catch (error) {
        console.error('Error deleting variable', error);
        throw error;
    }
}

export async function getAllVariablesAPI(){
    const token = await getAuthToken();
    const fullUrl = `${baseUrl}/v1/api/variable/all`

    try {
        const res = await axios.get(fullUrl , {
            headers: {
                'Content-Type': 'application/json',
                Authorization: token,

            },
        })

        return res.data
    } catch (error) {
        console.error( 'Error fetching Locations', error)
        throw error;
    }
}

export async function getAllInvoiceVariablesAPI(){
    const token = await getAuthToken();
    const fullUrl = `${baseUrl}/v1/invoiceVariable/all`

    try {
        const res = await axios.get(fullUrl , {
            headers: {
                'Content-Type': 'application/json',
                Authorization: token,

            },
        })

        return res.data
    } catch (error) {
        console.error( 'Error fetching Locations', error)
        throw error;
    }
}

export async function addautovariable(){
    const token = await getAuthToken();
    const fullUrl = `${baseUrl}/v1/api/variable/addautovariable`

    try {
        const res = await axios.get(fullUrl , {
            headers: {
                'Content-Type': 'application/json',
                Authorization: token,

            },
        })

        return res.data
    } catch (error) {
        console.error( 'Error auto Variables', error)
        throw error;
    }
}


  {/* PDF Template API */}

      
export async function addTemplate(fullHTML, selectedProduct ,templateName) {
    const token = await getAuthToken();
    const fullUrl = `${baseUrl}/v1/api/vendor-template/add`

    try {
        const res = await axios.post(
            fullUrl, 
            {
            //   htmlContent: JSON.stringify( fullHTML ),
              htmlContent: fullHTML,
              userProductId: selectedProduct,
              templateName: templateName
            },
            {
              headers: {
                'Content-Type': 'application/json',
                Authorization: token
              }
            }
          );

        return res.data
    } catch (error) {
        console.error( 'Error fetching variables', error)
        throw error;
    }
}
export async function addEmailTemplate(fullHTML ,templateName) {
    const token = await getAuthToken();
    const fullUrl = `${baseUrl}/v1/api/email-template/add`

    try {
        const res = await axios.post(
            fullUrl, 
            {
              htmlContent: fullHTML,
              templateName: templateName
            },
            {
              headers: {
                'Content-Type': 'application/json',
                Authorization: token
              }
            }
          );

        return res.data
    } catch (error) {
        console.error( 'Error fetching variables', error)
        throw error;
    }
}
      
export async function addInvoiceTemplate(fullHTML ,templateName) {
    const token = await getAuthToken();
    const fullUrl = `${baseUrl}/v1/invoicetemplate/add`

    try {
        const res = await axios.post(
            fullUrl, 
            {
              htmlContent: fullHTML,
              templateName: templateName
            },
            {
              headers: {
                'Content-Type': 'application/json',
                Authorization: token
              }
            }
          );

        return res.data
    } catch (error) {
        console.error( 'Error fetching variables', error)
        throw error;
    }
}
export async function updateInvoiceTemplate(fullHTML ,templateName) {
    const token = await getAuthToken();
    const fullUrl = `${baseUrl}/v1/invoicetemplate/update`

    try {
        const res = await axios.post(
            fullUrl, 
            {
              htmlContent: fullHTML,
              templateName: templateName
            },
            {
              headers: {
                'Content-Type': 'application/json',
                Authorization: token
              }
            }
          );

        return res.data
    } catch (error) {
        console.error( 'Error fetching variables', error)
        throw error;
    }
}
export async function getInvoiceTemplate() {
    const token = await getAuthToken();
    const fullUrl = `${baseUrl}/v1/invoicetemplate/all`

    try {
        const res = await axios.get(
            fullUrl, 
            {
              headers: {
                'Content-Type': 'application/json',
                Authorization: token
              }
            }
          );

        return res.data
    } catch (error) {
        console.error( 'Error fetching variables', error)
        throw error;
    }
}

      
export async function updateTemplate(fullHTML,name, id) {
    const token = await getAuthToken();
    const fullUrl = `${baseUrl}/v1/api/vendor-template/update`

    try {
        const res = await axios.post(
            fullUrl, 
            {
            //   htmlContent: JSON.stringify( fullHTML ),
                templateName:name,
              htmlContent: fullHTML,
              tempId: id
            },
            {
              headers: {
                'Content-Type': 'application/json',
                Authorization: token
              }
            }
          );

        return res.data
    } catch (error) {
        console.error( 'Error fetching variables', error)
        throw error;
    }
}
export async function updateEmailTemplate(fullHTML, name,id) {
    const token = await getAuthToken();
    const fullUrl = `${baseUrl}/v1/email-template/update`

    try {
        const res = await axios.post(
            fullUrl, 
            {
            //   htmlContent: JSON.stringify( fullHTML ),
            templateName:name,
              htmlContent: fullHTML,
              tempId: id
            },
            {
              headers: {
                'Content-Type': 'application/json',
                Authorization: token
              }
            }
          );

        return res.data
    } catch (error) {
        console.error( 'Error fetching variables', error)
        throw error;
    }
}


export async function getAllPDFtemplateById(id){
    const token = await getAuthToken();
    const fullUrl = `${baseUrl}/v1/api/template/getbyproduct?productId=${id}`

    try {
        const res = await axios.get(fullUrl , {
            headers: {
                'Content-Type': 'application/json',
                Authorization: token,
            },
        })

        return res.data
    } catch (error) {
        console.error( 'Error fetching templates', error)
        throw error;
    }
}

export async function getAllPDFtemplatesAPI(){
    const token = await getAuthToken();
    const fullUrl = `${baseUrl}/v1/api/vendor-template/all`

    try {
        const res = await axios.get(fullUrl , {
            headers: {
                'Content-Type': 'application/json',
                Authorization: token,
            },
        })

        return res.data
    } catch (error) {
        console.error( 'Error fetching Locations', error)
        throw error;
    }
}

export async function getDeletePDFtemplatesAPI(id){
    const token = await getAuthToken();
    const fullUrl = `${baseUrl}/v1/vendor-template/remove?tempId=${id}`

    try {
        const res = await axios.delete(fullUrl , {
            headers: {
                'Content-Type': 'application/json',
                Authorization: token,
            },
        })

        return res.data
    } catch (error) {
        console.error( 'Error fetching Locations', error)
        throw error;
    }
}

export async function getAllEmailtemplatesAPI(){
    const token = await getAuthToken();
    const fullUrl = `${baseUrl}/v1/api/email-template/all`

    try {
        const res = await axios.get(fullUrl , {
            headers: {
                'Content-Type': 'application/json',
                Authorization: token,
            },
        })

        return res.data
    } catch (error) {
        console.error( 'Error fetching Locations', error)
        throw error;
    }
}


export async function generatePDFApi(data) {
    const token = await getAuthToken();
    const fullUrl = `${baseUrl}/v1/api/pdf/generate`;

    try {
        const res = await axios.post(fullUrl, data, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: token,
            },
        });

        return res.data;
        } catch (error) {
        console.error('Error deleting template', error);
        throw error;
    
    }
}


export async function getInvoice(jobId) {
    const token = await getAuthToken();
    const fullUrl = `${baseUrl}/v1/invoice/get?jobId=${jobId}`;

    try {
        const res = await axios.get(fullUrl, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: token,
            },
        });

        return res.data;
        } catch (error) {
        console.error('Error deleting template', error);
        throw error;
    
    }
}

export async function generateInvoice(data) {
    const token = await getAuthToken();
    const fullUrl = `${baseUrl}/v1/inoicemanagment/generate`;

    try {
        const res = await axios.post(fullUrl,data, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: token,
            },
        });

        return res.data;
        } catch (error) {
        console.error('Error deleting template', error);
        throw error;
    
    }
}

export async function getInvoiceTemplates() {
    const token = await getAuthToken();
    const fullUrl = `${baseUrl}/v1/inoicetemplate/all`;

    try {
        const res = await axios.get(fullUrl, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: token,
            },
        });

        return res.data;
        } catch (error) {
        console.error('Error deleting template', error);
        throw error;
    
    }
}

export async function getInvoiceById() {
    const token = await getAuthToken();
    const fullUrl = `${baseUrl}/v1/invoice/getbyid`;

    try {
        const res = await axios.get(fullUrl, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: token,
            },
        });

        return res.data;
        } catch (error) {
        console.error('Error fetching template', error);
        throw error;
    
    }
}

export async function addInvoiceTemplates(payload) {
    const token = await getAuthToken();
    const fullUrl = `${baseUrl}/v1/invoice/add`;

    try {
        const res = await axios.post(fullUrl,payload, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: token,
            },
        });

        return res.data;
        } catch (error) {
        console.error('Error deleting template', error);
        throw error;
    
    }
}

export async function generateExcelInvoice(payload) {
    const token = await getAuthToken();
    const fullUrl = `${baseUrl}/v1/inoicemanagment/generate-sheet`;

    try {
        const res = await axios.post(fullUrl,payload, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: token,
            },
        });

        return res.data;
        } catch (error) {
        console.error('Error deleting template', error);
        throw error;
    
    }
}

export async function getInvoicePaymentStatus(status) {
    const token = await getAuthToken();
    const fullUrl = `${baseUrl}/v1/inoicemanagment/get?paymentStatus=${status}`;

    try {
        const res = await axios.get(fullUrl, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: token,
            },
        });

        return res.data;
        } catch (error) {
        console.error('Error deleting template', error);
        throw error;
    
    }
}

export async function updateInvoiceStatus(invoiceId) {
    const token = await getAuthToken();
    const fullUrl = `${baseUrl}/v1/inoicemanagment/update?invoiceId=${invoiceId}`;

    try {
        const res = await axios.get(fullUrl, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: token,
            },
        });
        
        return res.data;
        } catch (error) {
        console.error('Error deleting template', error);
        throw error;
    
    }
}

    {/* DASHBOARD API */}

export async function getInitaiateCountAPI(){

    const token = await getAuthToken();
    const fullUrl = `${baseUrl}/v1/dashboard/initaiatecount`

    try {
        const res = await axios.get(fullUrl , {
            headers: {
                'Content-Type': 'application/json',
                Authorization: token,

            },
        })

        return res.data
    } catch (error) {
        console.error( 'Error fetching dashboard data', error)
        throw error;
    }
}

export async function getAllCasesCountAPI(){

    const token = await getAuthToken();
    const fullUrl = `${baseUrl}/v1/api/dashboard/getAllCount`

    try {
        const res = await axios.get(fullUrl , {
            headers: {
                'Content-Type': 'application/json',
                Authorization: token,

            },
        })

        return res.data
    } catch (error) {
        console.error( 'Error fetching dashboard data', error)
        throw error;
    }
}


export async function getBackOfficeRecievedCountAPI(){

    const token = await getAuthToken();
    const fullUrl = `${baseUrl}/v1/dashboard/backofficerecievedcount`

    try {
        const res = await axios.get(fullUrl , {
            headers: {
                'Content-Type': 'application/json',
                Authorization: token,

            },
        })

        return res.data
    } catch (error) {
        console.error( 'Error fetching dashboard data', error)
        throw error;
    }
}

export async function getBackOfficeCompletedCountAPI(){

    const token = await getAuthToken();
    const fullUrl = `${baseUrl}/v1/dashboard/backofficecompletedcount`

    try {
        const res = await axios.get(fullUrl , {
            headers: {
                'Content-Type': 'application/json',
                Authorization: token,

            },
        })

        return res.data
    } catch (error) {
        console.error( 'Error fetching dashboard data', error)
        throw error;
    }
}

export async function getAgentRecievedCountAPI(){

    const token = await getAuthToken();
    const fullUrl = `${baseUrl}/v1/dashboard/agentrecievedcount`

    try {
        const res = await axios.get(fullUrl , {
            headers: {
                'Content-Type': 'application/json',
                Authorization: token,

            },
        })

        return res.data
    } catch (error) {
        console.error( 'Error fetching dashboard data', error)
        throw error;
    }
}

export async function getAgentCompletedCountAPI(){

    const token = await getAuthToken();
    const fullUrl = `${baseUrl}/v1/dashboard/agentcompleted`

    try {
        const res = await axios.get(fullUrl , {
            headers: {
                'Content-Type': 'application/json',
                Authorization: token,

            },
        })

        return res.data
    } catch (error) {
        console.error( 'Error fetching dashboard data', error)
        throw error;
    }
}

export async function getEmpTaskCountAPI(){

    const token = await getAuthToken();
    const fullUrl = `${baseUrl}/v1/dashboard/emptaskcount`

    try {
        const res = await axios.get(fullUrl , {
            headers: {
                'Content-Type': 'application/json',
                Authorization: token,

            },
        })

        return res.data
    } catch (error) {
        console.error( 'Error fetching dashboard data', error)
        throw error;
    }
}

export async function getProductWisecountCountAPI(){
    const token = await getAuthToken();
    const fullUrl = `${baseUrl}/v1/api/dashboard/taskByPartnerCount`

    try {
        const res = await axios.get(fullUrl , {
            headers: {
                'Content-Type': 'application/json',
                Authorization: token,

            },
        })

        return res.data
    } catch (error) {
        console.error( 'Error fetching dashboard data', error)
        throw error;
    }
}

export async function getServiceWisecountCountAPI(){
    
    const token = await getAuthToken();
    const fullUrl = `${baseUrl}/v1/api/dashboard/taskByServiceCount`

    try {
        const res = await axios.get(fullUrl , {
            headers: {
                'Content-Type': 'application/json',
                Authorization: token,

            },
        })

        return res.data
    } catch (error) {
        console.error( 'Error fetching dashboard data', error)
        throw error;
    }
}

export async function getAllCount(){
 
    // if (!accessToken && typeof window !== "undefined") {
    //     accessToken = localStorage.getItem("accessToken");
    // }
 
    const token = await getAuthToken();
    const fullUrl = `${baseUrl}/v1/api/dashboard/getAllCount`

    try {
        const res = await axios.get(fullUrl , {
            headers: {
                'Content-Type': 'application/json',
                Authorization: token,

            },
        })
 
        return res.data
    } catch (error) {
        console.error( 'Error fetching dashboard data', error)
        throw error;
    }
}


export async function getadCasesCount(){
 
    const token = await getAuthToken();
    const fullUrl = `${baseUrl}/v1/dashboard/adCasesCount`

    try {
        const res = await axios.get(fullUrl , {
            headers: {
                'Content-Type': 'application/json',
                Authorization: token,
            },
        })
 
        return res.data
    } catch (error) {
        console.error( 'Error fetching dashboard data', error)
        throw error;
    }
}
 
export async function getbackOfficeCount(){

    const token = await getAuthToken();
    const fullUrl = `${baseUrl}/v1/dashboard/backOfficeCount`

    try {
        const res = await axios.get(fullUrl , {
            headers: {
                'Content-Type': 'application/json',
                Authorization: token,

            },
        })
 
        return res.data
    } catch (error) {
        console.error( 'Error fetching dashboard data', error)
        throw error;
    }
}
 
export async function getbackOfficeCompleteCountAPI(){
 
    const token = await getAuthToken();
    const fullUrl = `${baseUrl}/v1/dashboard/backOfficeCompleteCount`

    try {
        const res = await axios.get(fullUrl , {
            headers: {
                'Content-Type': 'application/json',
                Authorization: token,

            },
        })
 
        return res.data
    } catch (error) {
        console.error( 'Error fetching dashboard data', error)
        throw error;
    }
}
 
export async function getclientCountAPI(){
 
    const token = await getAuthToken();
    const fullUrl = `${baseUrl}/v1/dashboard/clientCount`

    try {
        const res = await axios.get(fullUrl , {
            headers: {
                'Content-Type': 'application/json',
                Authorization: token,

            },
        })
 
        return res.data
    } catch (error) {
        console.error( 'Error fetching dashboard data', error)
        throw error;
    }
}
 
export async function getEmpCountAPI(){
   const token = await getAuthToken();
    const fullUrl = `${baseUrl}/v1/dashboard/empcount`

    try {
        const res = await axios.get(fullUrl , {
            headers: {
                'Content-Type': 'application/json',
                Authorization: token,

            },
        })
 
        return res.data
    } catch (error) {
        console.error( 'Error fetching dashboard data', error)
        throw error;
    }
}
 
export async function taskByEmpCountAPI(){
 
   const token = await getAuthToken();
    const fullUrl = `${baseUrl}/v1/api/dashboard/taskByEmpCount`

    try {
        const res = await axios.get(fullUrl , {
            headers: {
                'Content-Type': 'application/json',
                Authorization: token,

            },
        })
 
        return res.data
    } catch (error) {
        console.error( 'Error fetching dashboard data', error)
        throw error;
    }
}


{/* FETCH AI DATA */}

export async function getAiDataAPI(data){
    const token = await getAuthToken();
    const fullUrl = `${baseUrl}/v1/api/job/fetchaidata`

    try {
        const res = await axios.post(fullUrl ,data, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: token,

            },
        })

        return res.data
    } catch (error) {
        console.error( 'Error fetching AI data', error)
        throw error;
    }
}

export async function getAiEmpDataAPI(data){
    const paylaod = {
        jobProductId : data
    }
    
    const token = await getAuthToken();
    const fullUrl = `${baseUrl}/v1/job/fetchaidataemp`

    try {
        const res = await axios.post(fullUrl ,paylaod, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: token,

            },
        })

        return res.data
    } catch (error) {
        console.error( 'Error fetching AI data', error)
        throw error;
    }
}


export async function getConfigs(){
    const token = await getAuthToken();
    const fullUrl = `${baseUrl}/v1/api/config/getconfig`

    try {
        const res = await axios.get(fullUrl , {
            headers: {
                'Content-Type': 'application/json',
                Authorization: token,

            },
        })

        return res.data
    } catch (error) {
        console.error( 'Error fetching AI data', error)
        throw error;
    }
}

export async function updateConfigs(data){
    const token = await getAuthToken();
    const fullUrl = `${baseUrl}/v1/config/update`

    try {
        const res = await axios.post(fullUrl ,data, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: token,

            },
        })

        return res.data
    } catch (error) {
        console.error( 'Error fetching AI data', error)
        throw error;
    }
}




// Generic API request function

export const apiRequest = async (method, endpoint, data = null, params = {}) => {
    const token =await getAuthToken();
    const fullUrl = `${baseUrl}${endpoint}`;

    const headers = {
        'Content-Type': 'application/json',
        ...(token && { Authorization: token }) // Add Authorization only if token exists
    };

    try {
        const response = await axios({
            method,
            url: fullUrl,
            data,
            params,
            headers
        });

        return response.data;
    } catch (error) {
        console.error(`Error in API request (${method.toUpperCase()} ${endpoint}):`, error);
        throw error;
    }
};

export async function postAddProductApi(data){
    const token =await getAuthToken();
     
    const fullUrl = `${baseUrl}/v1/api/userproduct/add`

    try {
        const response = await axios.post(fullUrl, data, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: token,
            },
        });

        return response.data; 
    } catch (error) {
        console.error('Error posting data:', error);
        throw error;
    }
}

export async function updateProductApi(data){
    const token =await getAuthToken();
     
    const fullUrl = `${baseUrl}/v1/api/userproduct/update`

    try {
        const response = await axios.post(fullUrl, data, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: token,
            },
        });

        return response.data; 
    } catch (error) {
        console.error('Error posting data:', error);
        throw error;
    }
}

export async function deleteProductApi(data){
    const token =await getAuthToken();
     
    const fullUrl = `${baseUrl}/v1/api/userproduct/remove`

    try {
        const response = await axios.post(fullUrl, data, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: token,
            },
        });

        return response.data; 
    } catch (error) {
        console.error('Error posting data:', error);
        throw error;
    }
}

export async function postModuleApi(data){
    const token =await getAuthToken();
     
    const fullUrl = `${baseUrl}/v1/auth/my-profile`

    try {
        const response = await axios.get(fullUrl, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: token,
            },
        });

        return response.data; 
    } catch (error) {
        console.error('Error posting data:', error);
        throw error;
    }
}

export async function postRaiseExcelApi(data){
    const token =await getAuthToken();
     
    const fullUrl = `${baseUrl}/v1/job/raiseexcel?partnerId=${data.partnerId}&dateFilter=${data.filterType}&startDate=${data.startDate}&endDate=${data.endDate}`

    try {
        const response = await axios.get(fullUrl, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: token,
            },
        });

        return response.data; 
    } catch (error) {
        console.error('Error posting data:', error);
        throw error;
    }
}

//  {* Promoter API *}

export async function getPromoterApi(){
    const token =await getAuthToken();

    console.log('token',token);
     
    const fullUrl = `${baseUrl}/v1/promoter/all`;

    try {
        const response = await axios.get(fullUrl, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: token,
            },
        });

        return response.data; 
    } catch (error) {
        console.error('Error fetching company data:', error);
        throw error;
    } 
}

export async function postPromoterApi(data){
    const token =await getAuthToken();
     
    const fullUrl = `${baseUrl}/v1/promoter/add`

    try {
        const response = await axios.post(fullUrl, data, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: token,
            },
        });

        return response.data; 
    } catch (error) {
        console.error('Error posting data:', error);
        throw error;
    }
}

export async function updatePromoterApi(data){
    const token =await getAuthToken();
     
    const fullUrl = `${baseUrl}/v1/promoter/update`

    try {
        const response = await axios.post(fullUrl, data, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: token,

            },
        });

        return response.data; 
    } catch (error) {
        console.error('Error posting data:', error);
        throw error;
    }
}
  
export async function getIdByPromoterApi(id){
    const token =await getAuthToken();
     
    const fullUrl = `${baseUrl}/v1/promoter/get/${id}`

    try {
        const response = await axios.get(fullUrl, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: token,
            },
        });

        return response.data; 
    } catch (error) {
        console.error('Error fetching Branch data:', error);
        throw error;
    }
}

// export async function getParentBranchApi(id){
//     const token =await getAuthToken();
     
//     const fullUrl = `${baseUrl}/v1/branch/allparentbranch/${id}`

//     try {
//         const response = await axios.get(fullUrl, {
//             headers: {
//                 'Content-Type': 'application/json',
//                 Authorization: token,
//             },
//         });

//         return response.data; 
//     } catch (error) {
//         console.error('Error fetching Branch data:', error);
//         throw error;
//     } 
// }


export async function getAllServicesApi(){
    const token =await getAuthToken();
     
    const fullUrl = `${baseUrl}/v1/api/user-service/all`;

    try {
        const response = await axios.get(fullUrl, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: token,
            },
        });

        return response.data; 
    } catch (error) {
        console.error('Error fetching company data:', error);
        throw error;
    } 
}



//  {* Management API *}

export async function getManagementApi(){
    const token =await getAuthToken();

    console.log('token',token);
     
    const fullUrl = `${baseUrl}/v1/managment/all`;

    try {
        const response = await axios.get(fullUrl, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: token,
            },
        });

        return response.data; 
    } catch (error) {
        console.error('Error fetching company data:', error);
        throw error;
    } 
}

export async function postManagementApi(data){
    const token =await getAuthToken();
     
    const fullUrl = `${baseUrl}/v1/managment/add`

    try {
        const response = await axios.post(fullUrl, data, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: token,
            },
        });

        return response.data; 
    } catch (error) {
        console.error('Error posting data:', error);
        throw error;
    }
}

export async function updateManagementApi(data){
    const token =await getAuthToken();
     
    const fullUrl = `${baseUrl}/v1/managment/update`

    try {
        const response = await axios.post(fullUrl, data, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: token,

            },
        });

        return response.data; 
    } catch (error) {
        console.error('Error posting data:', error);
        throw error;
    }
}
  
export async function getIdByManagementApi(id){
    const token =await getAuthToken();
     
    const fullUrl = `${baseUrl}/v1/managment/find/${id}`

    try {
        const response = await axios.get(fullUrl, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: token,
            },
        });

        return response.data; 
    } catch (error) {
        console.error('Error fetching Branch data:', error);
        throw error;
    }
}


export async function postClientDataApi(data){
    const token =await getAuthToken();
     
    const fullUrl = `${baseUrl}/v1/api/request/createclient`

    try {
        const response = await axios.post(fullUrl, data, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: token,
            },
        });

        return response.data; 
    } catch (error) {
        console.error('Error posting data:', error);
        throw error;
    }
}


export async function getUserProductApi(id){
    const token =await getAuthToken();
     
    const fullUrl = `${baseUrl}/v1/userproduct/all?requestId=${id}`

    try {
        const response = await axios.get(fullUrl, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: token,
            },
        });

        return response.data; 
    } catch (error) {
        console.error('Error posting data:', error);
        throw error;
    }
}

export async function getUserFormProductApi(id){
    const token =await getAuthToken();
     
    const fullUrl = `${baseUrl}/v1/api/request/getFormByProduct?requestId=${id}`

    try {
        const response = await axios.get(fullUrl, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: token,
            },
        });

        return response.data; 
    } catch (error) {
        console.error('Error posting data:', error);
        throw error;
    }
}


export async function postUserAddProductApi(data){
    const token =await getAuthToken();
     
    const fullUrl = `${baseUrl}/v1/api/userproduct/add`

    try {
        const response = await axios.post(fullUrl, data, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: token,
            },
        });

        return response.data; 
    } catch (error) {
        console.error('Error posting data:', error);
        throw error;
    }
}


// export async function deleteUserProductApi(productId) {
//   const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
//   const fullUrl = `${baseUrl}/v1/userproduct/remove`;

//   try {
//     const response = await axios.post(
//       fullUrl,
//       { productId }, // pass as body
//       {
//         headers: {
//           'Content-Type': 'application/json',
//         },
//       }
//     );
//     return response.data;
//   } catch (error) {
//     console.error('Error deleting product:', error);
//     throw error;
//   }
// }


export async function deleteUserProductApi(productId) {
    const token = await getAuthToken();
    const fullUrl = `${baseUrl}/v1/api/userproduct/remove`;

    try {
        const res = await axios.post(fullUrl,productId, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: token,
            },
        });

        return res.data;
    } catch (error) {
        console.error('Error deleting variable', error);
        throw error;
    }
}


export async function postUserProductEditApi(data){
    const token =await getAuthToken();
     
    const fullUrl = `${baseUrl}/v1/api/userproduct/update`

    try {
        const response = await axios.post(fullUrl, data, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: token,
            },
        });

        return response.data; 
    } catch (error) {
        console.error('Error posting data:', error);
        throw error;
    }
}

//  {* Services API *}

export async function getServicesApi(){
    const token =await getAuthToken();

    console.log('token',token);
     
    const fullUrl = `${baseUrl}/v1/api/user-service/all`;

    try {
        const response = await axios.get(fullUrl, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: token,
            },
        });

        return response.data; 
    } catch (error) {
        console.error('Error fetching services data:', error);
        throw error;
    } 
}

export async function postServicesApi(data){
    const token =await getAuthToken();

    const fullUrl = `${baseUrl}/v1/api/user-service/add`

    try {
        const response = await axios.post(fullUrl, data, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: token,
            },
        });

        return response.data; 
    } catch (error) {
        console.error('Error posting data:', error);
        throw error;
    }
}
export async function updateServicesApi(data) {
    const token = await getAuthToken();

    const fullUrl = `${baseUrl}/v1/api/user-service/update`;

    try {
      const response = await axios.post(fullUrl, data, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: token
        }
      });
  
      return response.data;
    } catch (error) {
      console.error('Error posting data:', error);
      throw error;
    }
  }
  
  export async function getIdByServicesApi(id){
    const token = await getAuthToken();
    const fullUrl = `${baseUrl}/v1/api/user-service/get/${id}`;
  
    try {
      const response = await axios.get(fullUrl, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: token,
        },
      });
  
      return response.data; 
    } catch (error) {
      console.error('Error fetching service data:', error);
      throw error;
    }
  }
  

  export async function RemoveServicesAPI(serviceId) {
    const token = await getAuthToken();
    const fullUrl = `${baseUrl}/v1/api/user-service/remove/${serviceId}`;  // ID in URL
  
    try {
      const res = await axios.delete(fullUrl, {
        headers: {
          Authorization: token
        }
      });
      return res.data;
    } catch (error) {
      console.error('Error removing service:', error);
      throw error;
    }
  }


  export async function getAddCasesApi(){
    const token =await getAuthToken();

    console.log('token',token);
     
    const fullUrl = `${baseUrl}/v1/init/all`;

    try {
        const response = await axios.get(fullUrl, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: token,
            },
        });

        return response.data; 
    } catch (error) {
        console.error('Error fetching services data:', error);
        throw error;
    } 
}

  export async function getAllUnfilteredCasesApi(service, partnerId, dateRange , startDate, endDate) {
    const token =await getAuthToken();

    const fullUrl = `${baseUrl}/v1/api/init/iniated-data?serviceId=${service}&partnerId=${partnerId}&dateFilter=${dateRange}&startDate=${startDate}&endDate=${endDate}`;

    try {
        const response = await axios.get(fullUrl, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: token,
            },
        });

        return response.data; 
    } catch (error) {
        console.error('Error fetching services data:', error);
        throw error;
    } 
}
  export async function getAllUnfilteredInitCasesApi(serviceId, partnerId, dateRange , startDate, endDate) {
    const token =await getAuthToken();

    const fullUrl = `${baseUrl}/v1/api/init/backoffice-emp?serviceId=${serviceId}&partnerId=${partnerId}&dateFilter=${dateRange}&startDate=${startDate}&endDate=${endDate}`;

    try {
        const response = await axios.get(fullUrl, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: token,
            },
        });

        return response.data; 
    } catch (error) {
        console.error('Error fetching services data:', error);
        throw error;
    } 
}
  export async function getDashboardReportCasesApi(serviceId, partnerId, dateRange , startDate, endDate) {
    const token =await getAuthToken();

    console.log('token',token);

    const fullUrl = `${baseUrl}/v1/api/dashboard/report?serviceId=${serviceId}&partnerId=${partnerId}&dateFilter=${dateRange}&startDate=${startDate}&endDate=${endDate}`;

    try {
        const response = await axios.get(fullUrl, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: token,
            },
        });

        return response.data; 
    } catch (error) {
        console.error('Error fetching services data:', error);
        throw error;
    } 
}

  export async function getInvoiceDataApi( status,partnerId, dateRange , startDate, endDate) {
    const token =await getAuthToken();

    console.log('token',token);

    const fullUrl = `${baseUrl}/v1/api/init/invoice-data?paymentStatus=${status}&partnerId=${partnerId}&dateRange=${dateRange}&startDate=${startDate}&endDate=${endDate}`;

    try {
        const response = await axios.get(fullUrl, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: token,
            },
        });

        return response.data; 
    } catch (error) {
        console.error('Error fetching services data:', error);
        throw error;
    } 
}

  export async function getAllBackOfficeReqCasesApi(partnerId, dateRange , startDate, endDate) {
    const token =await getAuthToken();

    console.log('token',token);
     
    const fullUrl = `${baseUrl}/v1/job/getMyPendingJob?stageId=2&partnerId=${partnerId}&dateRange=${dateRange}&startDate=${startDate}&endDate=${endDate}`;

    try {
        const response = await axios.get(fullUrl, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: token,
            },
        });

        return response.data; 
    } catch (error) {
        console.error('Error fetching services data:', error);
        throw error;
    } 
}

  export async function getAllBackOfficeAcceptedCasesApi(stage,partnerId, dateRange , startDate, endDate) {
    const token =await getAuthToken();

    console.log('token',token);

    const fullUrl = `${baseUrl}/v1/job/getMyAcceptedJob?stageId=${stage}&partnerId=${partnerId}&dateRange=${dateRange}&startDate=${startDate}&endDate=${endDate}`;

    try {
        const response = await axios.get(fullUrl, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: token,
            },
        });

        return response.data; 
    } catch (error) {
        console.error('Error fetching services data:', error);
        throw error;
    } 
}

  export async function getAllBackOfficeAllocatedCasesApi(partnerId, dateRange , startDate, endDate) {
    const token =await getAuthToken();

    console.log('token',token);
     
    const fullUrl = `${baseUrl}/v1/job/allocatedjob?&partnerId=${partnerId}&dateRange=${dateRange}&startDate=${startDate}&endDate=${endDate}`;

    try {
        const response = await axios.get(fullUrl, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: token,
            },
        });

        return response.data; 
    } catch (error) {
        console.error('Error fetching services data:', error);
        throw error;
    } 
}

export async function postAddCasesApi(data){
    const token =await getAuthToken();
     
    const fullUrl = `${baseUrl}/v1/api/init/add`;

    try {
        const response = await axios.post(fullUrl, data, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: token,
            },
        });

        return response.data; 
    } catch (error) {
        console.error('Error posting data:', error);
        throw error;
    }
}
export async function updateAddCasesApi(data) {
    const token = await getAuthToken();
  
    const fullUrl = `${baseUrl}/v1/api/init/update`;
  
    try {
      const response = await axios.post(fullUrl, data, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: token,
        }
      });
  
      return response.data;
    } catch (error) {
      console.error('Error posting data:', error);
      throw error;
    }
  }

  export async function postAllocateApi(data) {
    const token = await getAuthToken();
  
    const fullUrl = `${baseUrl}/v1/api/init/allocate`;
  
    try {
      const response = await axios.post(fullUrl, data, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: token
        },
      });
  
      return response.data;
    } catch (error) {
      console.error('Error posting data:', error);
      throw error;
    }
  }
  

  export async function getIdByAllocateApi(id){
    const token = await getAuthToken();
    const fullUrl = `${baseUrl}/v1/init/get/${id}`;
  
    try {
      const response = await axios.get(fullUrl, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: token,
        },
      });
  
      return response.data; 
    } catch (error) {
      console.error('Error fetching service data:', error);
      throw error;
    }
  }


  export async function getAllAddCasesApi(){
    const token =await getAuthToken();

    console.log('token',token);
     
    const fullUrl = `${baseUrl}/v1/init/allbyemp`;

    try {
        const response = await axios.get(fullUrl, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: token,
            },
        });

        return response.data; 
    } catch (error) {
        console.error('Error fetching services data:', error);
        throw error;
    } 
}

export const getpartnerproduct = async (requestId, referId, initId) => {
        const token =await getAuthToken();

    console.log('token',token);
     
    const fullUrl = `${baseUrl}/v1/api/job/getpartnerproduct?requestId=${requestId}&referId=${referId}&initId=${initId}`;

    try {
        const response = await axios.get(fullUrl, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: token,
                
            },
        });

        return response.data; 
    } catch (error) {
        console.error('Error fetching services data:', error);
        throw error;
    } 
}
    

export async function getInitDownloadExcelAPI (id){
    const token = await getAuthToken();
     
    const fullUrl = `${baseUrl}/v1/api/init/generate`

    try {
        const response = await axios.get(fullUrl, {
            headers: {
                'Content-Type':  'application/json',
                Authorization: token,

            },
        });

        return response.data; 
    } catch (error) {
        console.error('Error posting  Job data:', error);
        throw error;
    }
}

export async function uploadReadExcelAPI (pId,sId, data){
    const payload = {
        sheet: data,
    };
    const token = await getAuthToken();
     
    const fullUrl = `${baseUrl}/v1/api/init/read?partnerId=${pId}&&serviceId=${sId}`

    try {
        const response = await axios.post(fullUrl, payload, {
            headers: {
                'Content-Type':  'multipart/form-data',
                Authorization: token,

            },
        });

        return response.data; 
    } catch (error) {
        console.error('Error posting  Job data:', error);
        throw error;
    }
}


export async function postAddCaseForAiApi(data){
    const token =await getAuthToken();
     
    const fullUrl = `${baseUrl}/v1/api/job/addcaseaidata`

    try {
        const response = await axios.post(fullUrl, data, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: token,
            },
        });

        return response.data; 
    } catch (error) {
        console.error('Error posting data:', error);
        throw error;
    }
}


export async function getDashBoardCount(id) {
    const token = await getAuthToken();
    
    const fullUrl = `${baseUrl}/v1/api/init/dashboard-count`;

    try {
        const res = await axios.get(fullUrl, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: token,
            },
        });

        return res.data;
    } catch (error) {
        console.error('Error fetching invoice template:', error);
        throw error;
    }
}

export async function getInitDashBoardCount() {     
    const token = await getAuthToken();
    
    const fullUrl = `${baseUrl}/v1/api/init/init-dashboard`;

    try {
        const res = await axios.get(fullUrl, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: token,
            },
        });

        return res.data;
    } catch (error) {
        console.error('Error fetching invoice template:', error);
        throw error;
    }
}

export async function getBackOfficeDashBoardCount() {     
    const token = await getAuthToken();
    
    const fullUrl = `${baseUrl}/v1/job/job-count`;

    try {
        const res = await axios.get(fullUrl, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: token,
            },
        });

        return res.data;
    } catch (error) {
        console.error('Error fetching invoice template:', error);
        throw error;
    }
}
export async function getInvoiceDashBoardCount() {     
    const token = await getAuthToken();
    
    const fullUrl = `${baseUrl}/v1/api/init/invoice-dashboard`;

    try {
        const res = await axios.get(fullUrl, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: token,
            },
        });

        return res.data;
    } catch (error) {
        console.error('Error fetching invoice template:', error);
        throw error;
    }
}



//  {* New Init Dyanmic Form  API *}

export async function getInitFormApi(){
    const token =await getAuthToken();

    console.log('token',token);
     
    const fullUrl = `${baseUrl}/v1/api/initFields/all`;

    try {
        const response = await axios.get(fullUrl, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: token,
            },
        });

        return response.data; 
    } catch (error) {
        console.error('Error fetching services data:', error);
        throw error;
    } 
}

export async function postInitFormApi(data){
    const token =await getAuthToken();

     
    const fullUrl = `${baseUrl}/v1/api/initFields/add`

    try {
        const response = await axios.post(fullUrl, data, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: token,
            },
        });

        return response.data; 
    } catch (error) {
        console.error('Error posting data:', error);
        throw error;
    }
}
export async function updateInitFormApi(data) {
    const token = await getAuthToken();
  
    const fullUrl = `${baseUrl}/v1/initFields/update`;
  
    try {
      const response = await axios.post(fullUrl, data, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: token
        }
      });
  
      return response.data;
    } catch (error) {
      console.error('Error posting data:', error);
      throw error;
    }
  }
  
//   export async function getIdByInitFormApi(id){
//     const token = await getAuthToken();
//     const fullUrl = `${baseUrl}/v1/initFields/get/${id}`;
  
//     try {
//       const response = await axios.get(fullUrl, {
//         headers: {
//           'Content-Type': 'application/json',
//           Authorization: token,
//         },
//       });
  
//       return response.data; 
//     } catch (error) {
//       console.error('Error fetching service data:', error);
//       throw error;
//     }
//   }
  

  export async function RemoveInitFormAPI(serviceId) {
    const token = await getAuthToken();
    const fullUrl = `${baseUrl}/v1/initFields/remove/${serviceId}`;  // ID in URL
  
    try {
      const res = await axios.delete(fullUrl, {
        headers: {
          Authorization: token
        }
      });
      return res.data;
    } catch (error) {
      console.error('Error removing service:', error);
      throw error;
    }
  }


//   get api of subadmins
export async function GetSubadminsAPI() {
  const token = await getAuthToken()
  const fullUrl = `${baseUrl}/v1/auth/get-admin`
 
  try {
    const res = await axios.get(fullUrl, {
      headers: {
        Authorization: token
      }
    })
    return res.data
  } catch (error) {
    console.error('Error fetching subadmins:', error)
    throw error
  }
}
 
//   add api of subadmins
export async function AddSubadminAPI(subadminData) {
  const token = await getAuthToken()
  const fullUrl =` ${baseUrl}/v1/auth/add-subadmin`
  try {
    const res = await axios.post(fullUrl, subadminData, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: token
      }
    })
    return res.data
  } catch (error) {
    console.error('Error adding subadmin:', error)
    throw error
  }
}


export async function sendEmailAPI(subadminData) {
  const token = await getAuthToken()
  const fullUrl =` ${baseUrl}/v1/api/mail/send`
  try {
    const res = await axios.post(fullUrl, subadminData, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: token
      }
    })
    return res.data
  } catch (error) {
    console.error('Error adding subadmin:', error)
    throw error
  }
}

sendEmailAPI