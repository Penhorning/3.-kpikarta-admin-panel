import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import './edit-user.scss';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import 'intl-tel-input/build/css/intlTelInput.css';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/material.css';
import { useParams, useHistory } from 'react-router-dom';
import MenuItem from '@mui/material/MenuItem';
import { UserService } from '../../../jwt/_services';
import { useSnackbar } from 'notistack';
import Spinner from '../../spinner-loader/spinner-loader';
import Grid from '@mui/material/Grid';
import 'antd/dist/antd.css';
import { message, Upload } from 'antd';
import ImgCrop from 'antd-img-crop';
import Constants from '../../../jwt/_helpers/constants';

const initialValues = {
  fullName: '',
  email: '',
  mobile: {},
  telephone: '',
  profilePic:''
}
const initialCompanyValues = {
  companyName: '',
  companyJobTitle: '',
  companyDepartment: '',
  companyEmployeeRange: ''
}

export default function EditUser() {
  const [value, setValue] = useState('1');
  const [department, setDepartment] = useState([]);
  const [employeeRange, setEmployeeRange] = useState([])
  const [companyId, setCompanyID] = useState([]);
  const [profilePic, setProfilePic] = useState('');
  const [oldCompanyLogo, setOldCompanyLogo] = useState('');
  const [newCompanyLogo, setNewCompanyLogo] = useState('');
  const [loading, setLoading] = useState(true);
  const { id } = useParams();
  const history = useHistory();
  const { enqueueSnackbar } = useSnackbar();
  const actionUrlCompany = `${Constants.BASE_URL}/api/Containers/company/upload`;
  const actionUrlUser = `${Constants.BASE_URL}/api/Containers/user/upload`;
  const [fileList, setFileList] = useState([
    {
      uid: '-1',
      name: '',
      status: 'done',
      url: '',
      thumbUrl: ''
    },
  ]);
  const [compFileList, setCompFileList] = useState([
    {
      uid: '-1',
      name: '',
      status: 'done',
      url: '',
      thumbUrl: ''
    },
  ]);

  const validationSchema = Yup.object().shape({
    fullName: Yup.string().trim().required('Full Name is required!'),
    email: Yup.string().email().required('Valid email is required!'),
    mobile: Yup.object().required('Mobile number is required!')
  });

  const companyValidationSchema = Yup.object().shape({
    companyName: Yup.string().trim().required('Company Name is required!')
  });

  useEffect(() => {
    // get individula user data by passing user id
    UserService.getUserDetails(id).then(response => {
      const { fullName, email, mobile, telephone } = response;
      initialValues.fullName = fullName;
      initialValues.email = email;
      initialValues.mobile = response.mobile ? mobile : "";
      initialValues.telephone = response.telephone ? telephone : " ";

      // set user profile picture
      setFileList(
        [
          {
            uid: response.id,
            thumbUrl:  response.profilePic ? `${Constants.BASE_URL}/user/${response.profilePic}`:`${'https://i.ibb.co/wynJtDH/avatar.png'}`,
            status: 'done',
            url: ''
          },
        ]
      )
      setLoading(false)
    });

    UserService.getDepartment().then(response => {
      setDepartment(response);
    })

    UserService.getEmployeeRange().then(response => {
      setEmployeeRange(response);
    })

    // get company data by passing user company ID
    UserService.getCompanyDetails(id).then(response => {
      const { name, job_title, departmentId, employeesRangeId } = response;
      setCompanyID(response.id)
      initialCompanyValues.companyName = name;
      initialCompanyValues.companyJobTitle = job_title;
      initialCompanyValues.companyDepartment = departmentId;
      initialCompanyValues.companyEmployeeRange = employeesRangeId;
      setOldCompanyLogo(response.logo);
      // set new comapny logo on UI
      setCompFileList(
        [
          {
            uid: response.id,
            thumbUrl:  response.logo ? `${Constants.BASE_URL}/company/${response.logo}`:`${'https://i.ibb.co/9G3XdFq/comapny-logo.png'}` ,
            status: 'done',
            url: ''
          },
        ]
      )
      setLoading(false)
    });
  }, [id])

  // user data update button
  const onUpdateSubmit = (values) => {
    const result = window.confirm("Are you sure, you want to update profile?");
    if (result) {
      let data = {
        fullName: values.fullName,
        email: values.email,
        mobile: values.mobile,
        telephone: values.telephone,
        profilePic: profilePic == '' ? initialValues.profilePic : profilePic,
      };
      UserService.updateUser(id, data).then((response) => {
        if (response = true) {
          let variant = "success";
          enqueueSnackbar('User details upadated successfully.', { variant });
          history.push('/users');
        }
      })
    }
  }

  // company data upadate button
  const onCompanySubmit = (values) => {
    const result = window.confirm("Are you sure, you want to update company details?");
    if (result) {
      let companyIds = companyId;
      let data = {
        name: values.companyName,
        job_title: values.companyJobTitle,
        departmentId: values.companyDepartment,
        employeesRangeId: values.companyEmployeeRange,
        logo: newCompanyLogo == '' ? oldCompanyLogo : newCompanyLogo,
        oldCompanyLogo: newCompanyLogo == '' ? newCompanyLogo : oldCompanyLogo,
      };
      UserService.upadateCompanyDetails(companyIds, data).then(response => {
        if (response = true) {
          let variant = "success";
          enqueueSnackbar('Company details upadated successfully.', { variant });
          history.push('/users');
        }
      })
    }
  }

  // user profile photo change
  const onUserPhotoChange = ({ fileList: newFileList }) => {
    setFileList(newFileList);
    if (newFileList[0].response) {
      setProfilePic(newFileList[0].response.result.files.photo[0].name)
    }
  };

  // user company profile photo change
  const onCompanyPhotoChange = ({ fileList: newFileList }) => {
    setCompFileList(newFileList);
    if (newFileList[0].response) {
      setNewCompanyLogo(newFileList[0].response.result.files.photo[0].name)
    }
  };
 
  //upload file data restrictions
  const beforeUpload = (file) => {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
  
    if (!isJpgOrPng) {
      message.error('You can only upload JPG/PNG file!');
    }
  
    const isLt2M = file.size / 1024 / 1024 < 2;
  
    if (!isLt2M) {
      message.error('Image must smaller than 2MB!');
    }
  
    return isJpgOrPng && isLt2M;
  };

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const onBackClick = () => {
    history.push('/users');
}
  return (
    <Box sx={{}}>
      <Paper sx={{ mb: 2 }}>
        <Toolbar>
          <Typography
            sx={{ flex: '1 1 20%' }}
            variant="h6"
            id="tableTitle"
            component="div"
          >
            Update Profile
          </Typography>
          <Button variant="outlined" onClick={onBackClick}>Back</Button>
        </Toolbar>
        <TabContext value={value} >
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <TabList onChange={handleChange} aria-label="lab API tabs example" id="user_tab">
              <Tab label="Personal Details" value="1" />
              <Tab label="Company Details" value="2" />
            </TabList>
          </Box>
          {loading ? (<Spinner />) :
            <TabPanel value="1">
              <Paper
                sx={{
                  p: 2,
                  margin: 'auto',
                  maxWidth: 830,
                  flexGrow: 1,
                }}
                style={{ height: 140 }}
              >
                <Grid container spacing={2}>
                  <Grid item xs={2}>
                  </Grid>
                  <Grid item xs={4}>
                    <ImgCrop >
                      <Upload
                        listType="picture-card"
                        fileList={fileList}
                        showUploadList={{
                          showRemoveIcon: false,
                        }}
                      >
                      </Upload>
                    </ImgCrop>
                  </Grid>
                  <Grid item xs={6} >
                    <ImgCrop grid rotate shape={'round'}>
                      <Upload
                        action={actionUrlUser}
                        name={'photo'}
                        maxCount={1}
                        showUploadList={false}
                        onChange={onUserPhotoChange}
                        beforeUpload={beforeUpload}
                      >
                        <Button variant="contained" style={{ marginTop: '40px', marginLeft: '150px' }} component="label">
                          Upload
                        </Button>
                      </Upload>
                    </ImgCrop>
                  </Grid>
                </Grid>
              </Paper>
              <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={onUpdateSubmit} >
                {({ errors, values, touched }) => (
                  <Form>
                    <Box sx={{
                      display: 'flex',
                      alignItems: 'center',
                      '& > :not(style)': {}
                    }}
                      style={{ alignSelf: 'center' }}>
                      <Field name="fullName">
                        {({ field }) => (
                          <TextField
                            label="Full Name"
                            fullWidth
                            display='flex'
                            {...field ?? ''}
                            style={{ margin: '20px', marginLeft: '25px' }}
                            error={errors.fullName && touched.fullName ? true : false}
                            helperText={(errors.fullName && touched.fullName ? `${errors.fullName}` : '')}
                          />
                        )}
                      </Field>
                      <Field name="email">
                        {({ field }) => (
                          <TextField
                            label="Email"
                            fullWidth
                            disabled={true}
                            display='flex'
                            {...field}
                            style={{ margin: '20px', marginRight: '25px' }}
                            error={errors.email && touched.email ? true : false}
                            helperText={(errors.email && touched.email ? 'Email is required!' : '')}
                          />
                        )}
                      </Field>
                    </Box>
                    <Box sx={{
                      display: 'flex',
                      alignItems: 'center',
                      '& > :not(style)': {}
                    }}
                      style={{ alignSelf: 'center' }}>
                      <Field name="mobile">
                        {({ field }) => (
                          <PhoneInput
                            inputProps={{
                              name: 'phone',
                              required: true,
                            }}
                            country={'us'}
                            onChange={(e) => { values.mobile = { e164Number: `+${e}` } }}
                            value={values.mobile.e164Number}
                            style={{ margin: '20px', marginRight: '25px' }}
                          />
                        )}
                      </Field>
                      <Field name="telephone">
                        {({ field }) => (
                          <TextField
                            label="Telephone"
                            fullWidth
                            display='flex'
                            {...field}
                            style={{ margin: '20px', marginRight: '25px' }}
                          />
                        )}
                      </Field>
                    </Box>
                    <Button
                      style={{
                        width: 100,
                        marginLeft: '25px',
                        marginTop: '25px',
                        marginBottom: '25px'
                      }}
                      variant="contained"
                      size="medium"
                      type='submit'
                    >
                      Update
                    </Button>
                  </Form>
                )}
              </Formik>
            </TabPanel>
          }
          {loading ? (<Spinner />) :
            <TabPanel value="2">
              <Paper
                sx={{
                  p: 2,
                  margin: 'auto',
                  maxWidth: 830,
                  flexGrow: 1,
                }}
                style={{ height: 140 }}
              >
                <Grid container spacing={2}>
                  <Grid item xs={2}>
                  </Grid>
                  <Grid item xs={4}>
                    <ImgCrop >
                      <Upload
                        listType="picture-card"
                        fileList={compFileList}
                        showUploadList={{
                          showRemoveIcon: false,
                        }}
                      >
                      </Upload>
                    </ImgCrop>
                  </Grid>
                  <Grid item xs={6}>
                    <ImgCrop grid rotate aspect={5}>
                      <Upload
                       beforeUpload={beforeUpload}
                        onChange={onCompanyPhotoChange}
                        action={actionUrlCompany}
                        name={'photo'}
                        maxCount={1}
                        showUploadList={false}
                      >
                        <Button variant="contained" style={{ marginTop: '45px', marginLeft: '150px' }} component="label">
                          Upload
                        </Button>
                      </Upload>
                    </ImgCrop>
                  </Grid>
                </Grid>
              </Paper>
              <Formik initialValues={initialCompanyValues} validationSchema={companyValidationSchema} onSubmit={onCompanySubmit} >
                {({ errors, values, touched }) => (
                  <Form>
                    <Box sx={{
                      display: 'flex',
                      alignItems: 'center',
                      '& > :not(style)': {}
                    }}
                      style={{ alignSelf: 'center' }}>
                      <Field name="companyName">
                        {({ field }) => (
                          <TextField
                            type="text"
                            label="Company Name"
                            fullWidth
                            value={values}
                            display='flex'
                            {...field}
                            style={{ margin: '20px', marginLeft: '25px' }}
                            error={errors.companyName && touched.companyName ? true : false}
                            helperText={(errors.companyName && touched.companyName ? `${errors.companyName}` : '')}
                            defaultValue={undefined}
                          />
                        )}
                      </Field>
                      <Field name="companyJobTitle">
                        {({ field }) => (
                          <TextField
                            type="text"
                            label="Job Title"
                            fullWidth
                            display='flex'
                            {...field}
                            style={{ margin: '20px', marginLeft: '25px' }}
                            error={errors.companyJobTitle && touched.companyJobTitle ? true : false}
                            helperText={(errors.companyJobTitle && touched.companyJobTitle ? `${errors.companyJobTitle}` : '')}
                            defaultValue={undefined}
                          />
                        )}
                      </Field>
                    </Box>
                    <Box sx={{
                      display: 'flex',
                      alignItems: 'center',
                      '& > :not(style)': {}
                    }}
                      style={{ alignSelf: 'center', marginLeft: '5px' }}>
                      <Field name="companyDepartment">
                        {({ field }) => (
                          <TextField
                            id='ref'
                            type="text"
                            select
                            label="Department"
                            fullWidth
                            display='flex'
                            style={{ margin: '20px', marginRight: '25px' }}
                            {...field}
                            defaultValue={undefined}
                          >
                            {department.map((option) => (
                              <MenuItem key={option.id} value={option.id}>
                                {option?.name || ''}
                              </MenuItem>
                            ))}
                          </TextField>
                        )}
                      </Field>
                      <Field name="companyEmployeeRange" >
                        {({ field }) => (
                          <TextField
                            id={employeeRange.id}
                            type="text"
                            select
                            label="Number of Employees"
                            fullWidth
                            display='flex'
                            style={{ margin: '20px', marginRight: '25px' }}
                            {...field}
                            defaultValue={undefined}
                          >
                            {employeeRange.map((option) => (
                              <MenuItem key={option.id} value={option.id}>
                                {option?.range || ''}
                              </MenuItem>
                            ))}
                          </TextField>
                        )}
                      </Field>
                    </Box>

                    <Button
                      style={{
                        width: 100,
                        marginLeft: '25px',
                        marginTop: '25px',
                        marginBottom: '25px'
                      }}
                      variant="contained"
                      size="medium"
                      type='submit'
                    >
                      Update
                    </Button>
                  </Form>
                )}
              </Formik>
            </TabPanel>
          }
        </TabContext>
      </Paper>
    </Box>
  );
}
