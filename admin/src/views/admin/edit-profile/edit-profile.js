import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import TabContext from '@mui/lab/TabContext';
import TabPanel from '@mui/lab/TabPanel';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import './edit-profile.scss';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import 'intl-tel-input/build/css/intlTelInput.css';
import { useSnackbar } from 'notistack';
import Spinner from '../../spinner-loader/spinner-loader';
import Grid from '@mui/material/Grid';
import 'antd/dist/antd.css';
import { message, Upload } from 'antd';
import ImgCrop from 'antd-img-crop';
import Constants from '../../../shared/_helpers/constants';
import {useHistory } from 'react-router-dom';
import { AuthenticationService } from '../../../shared/_services';
import { UserService } from '../../../shared/_services';



const initialValues = {
  fullName: '',
  email: '',
  profilePic: ''
}

export default function EditProfile() {
  const [value, setValue] = useState('1');
  const [profilePic, setProfilePic] = useState('');
  const [loading, setLoading] = useState(true);
  const [userId, setUserIds] = useState(AuthenticationService.currentUser.source._value.userId);
  const { enqueueSnackbar } = useSnackbar();
  const actionUrlUser = `${Constants.BASE_URL}/api/Containers/user/upload`;
  const [isOpenBtn, setIsOpenBtn] = useState(false);
  const history = useHistory();
  const [fileList, setFileList] = useState([
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
    email: Yup.string().trim().email().required('Email is required!')
  });



  useEffect(() => {
    // get individula user data by passing user id
    UserService.getUserDetails(userId).then(response => {
      const { fullName, email, profilePic} = response;
      initialValues.fullName = fullName;
      initialValues.email = email;
      initialValues.profilePic = profilePic;

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

  }, [userId])

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
      setIsOpenBtn(true)
      UserService.updateUser(userId, data).then((response) => {
        if (response) {
            let variant = "success";
            enqueueSnackbar('Admin details upadated successfully.', { variant });
            setIsOpenBtn(false)
            window.location.reload();
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
  }

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
            View Profile
          </Typography>
          <Button variant="outlined" onClick={onBackClick}>Back</Button>
        </Toolbar>
        <TabContext value={value} >
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
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
                {({ errors, touched }) => (
                      <Grid
                      sx={{
                        margin: 'auto',
                        maxWidth: 830,
                        flexGrow: 1,
                      }}
                      style={{ height: 160 }}
                    >
                  <Form>
                    <Box sx={{
                      display: 'flex',
                      alignItems: 'center',
                      '& > :not(style)': {  }
                     }}
                      style={{ alignSelf: 'center' }}>
                      <Field name="fullName">
                        {({ field }) => (
                          <TextField
                            label="Full Name"
                            fullWidth
                            display='flex'
                            {...field ?? ''}
                            style={{ marginTop: '20px', marginRight: '10px' }}
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
                            type='email'
                            display='flex'
                            {...field}
                            style={{ marginTop: '20px', marginLeft: '10px' }}
                            error={errors.email && touched.email ? true : false}
                            helperText={(errors.email && touched.email ? `${errors.email}` : '')}
                          />
                        )}
                      </Field>
                    </Box>
                    <Button
                      style={{
                        width: 100,
                        marginTop: '25px',
                        marginBottom: '25px'
                      }}
                      variant="contained"
                      size="medium"
                      type='submit'
                      disabled={isOpenBtn}
                    >
                      Update
                    </Button>
                  </Form>
                  </Grid>
                )}
              </Formik>
            </TabPanel>
          }
        </TabContext>
      </Paper>
    </Box>
  );
}
