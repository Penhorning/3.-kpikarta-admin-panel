import * as React from 'react';
import { useState, useEffect } from "react";

import './suggestion.scss';
import { SuggestionService } from '../../jwt/_services/suggestion.service';

import { Formik, Form, Field, FieldArray } from 'formik';
import * as Yup from 'yup';

import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import { Grid, TextField } from '@mui/material';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import LinearProgress from '@mui/material/LinearProgress';
import Alert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';



export default function Suggestion() {
  const [phases, setPhases] = useState([]);
  const [suggestion, setSuggestion] = useState({});
  const [suggestionInput, setSuggestionInput] = useState(true);
  const [descDisArr, setDescDisArr] = useState([]);
  const [tabValue, setTabValue] = React.useState('62b07978c389310e2c74f586');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [saveDatatost, setSaveDatatost] = useState(false);
  

  // Suggestion form
  const initialValues = {
    definition: "",
    descriptions: []
  };
  const validationSchema = Yup.object().shape({
    definition: Yup.string().required('Definition is required!'),
    descriptions: Yup.array().of(
      Yup.object().shape({
        description: Yup.string().required('Description is required')
      })
    )
  });

  const addDescription = (errors, values, setValues) => {
    if (!('descriptions' in errors)) {
      const descriptions = [...values.descriptions];
      descriptions.push({ description: "" });
      setValues({ ...values, descriptions });
      const disableArray = [...descDisArr];
      disableArray.push(false);
      setDescDisArr(disableArray);
    }
  }
  const deleteDescription = (values, setValues, index) => {
    const descriptions = [...values.descriptions];
    descriptions.splice(index, 1);
    setValues({ ...values, descriptions });
    const disableArray = [...descDisArr];
    disableArray.splice(index, 1);
    setDescDisArr(disableArray);
  }

  const enableDescription = (index) => {
    const disableArray = [...descDisArr];
    disableArray[index] = false;
    setDescDisArr(disableArray);
  }

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSaveDatatost(false);
  };


  const onSubmit = (values) => {
    const result = window.confirm("Are you sure do you want to save this suggestion?");
   if(result){
    setSubmitting(true);
    let suggestionId = values.id;
    let data = {
      definition: values.definition,
      descriptions: values.descriptions
    };
    SuggestionService.updateSuggestion(suggestionId, data).then(response => {
      setSubmitting(false);
      setSaveDatatost(true);
    });
   }
  }

  // Get phases
  const getPhases = () => {
    SuggestionService.getPhases().then(response => {
      setPhases(response);
      setTabValue(response[0].id);
      getSuggestion(response[0].id);
    });
  }
  // Get suggestion
  const getSuggestion = (phaseId) => {
    // setLoading(true);
    SuggestionService.getSuggestion({phaseId}).then(response => {
      initialValues.definition = response.definition;
      for (let i=0; i<response.descriptions.length; i++) {
        initialValues.descriptions.push({ description: response.descriptions[i].description });
        const disableArray = [...descDisArr];
        disableArray.push(true);
        setDescDisArr(disableArray);
      }
      setSuggestion(response);
      setLoading(false);
    });
  }

  // On init
  useEffect(() => {
    getPhases();
  }, []);


  // On tab change
  const onTabChange = (event, newValue) => {
    setTabValue(newValue);
    getSuggestion(newValue);
  };

  return loading ? (<LinearProgress />) : (
    <Box sx={{ width: '100%' }}>
      <Paper sx={{ width: '100%', mb: 2 }}>
        <Toolbar>
          <Typography
            sx={{ flex: '1 1 20%' }}
            variant="h6"
            id="tableTitle"
            component="div"
          >
            Suggestions
          </Typography>
        </Toolbar>
        <TabContext value={tabValue}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <TabList onChange={onTabChange} aria-label="tab-example">
              {
                phases.map((item, index) => (
                  <Tab label={item.name} value={item.id} key={index} />
                ))
              }
            </TabList>
          </Box>
          <TabPanel value={tabValue}>
          <Formik enableReinitialize={true} initialValues={suggestion} validationSchema={validationSchema} onSubmit={onSubmit}>
            {({ errors, values, touched, setValues}) => (
            <Form>
              {/* Definition */}
              <Typography
                sx={{ flex: '1 1 20%' }}
                variant="h6"
                id="tableTitle"
                component="div"
              >
                Definition
              </Typography>
              <div className="mt-3">
                <Field name="definition">
                  {({ field }) => (
                    <TextField
                    fullWidth
                    label="Definition"
                    multiline
                    maxRows={4}
                    {...field}
                    error={errors.definition && touched.definition ? true: false}
                    helperText={(errors.definition && touched.definition ? 'Definition is required!' : '')}
                    />
                  )}
                </Field>
              </div>

              {/* Suggestions */}
              <Typography
                sx={{ flex: '1 1 20%', mt:4 }}
                variant="h6"
                id="tableTitle"
                component="div"
              >
                Suggestions
              </Typography>
              <FieldArray name="descriptions">
                {() => (values.descriptions.map((item, index) => {
                  const descriptionsErrors = errors.descriptions?.length && errors.descriptions[index] || {};
                  const descriptionsTouched = touched.descriptions?.length && touched.descriptions[index] || {};
                  return (
                  <div key={index} className={ index > 0 ? "mt-2": ""}>
                    <Grid container className="justify-content-end">
                      <EditIcon onClick={() => enableDescription(index)} style={{ cursor: "pointer" }} />
                      {
                        values.descriptions.length > 1
                        ? 
                        <DeleteIcon sx={{ color: "#d32f2f" }} onClick={()=> deleteDescription(values, setValues, index) } style={{ cursor: "pointer" }} />
                        : ""
                      }
                      {
                        index === 0 ? <AddCircleIcon color="primary" onClick={()=> addDescription(errors, values, setValues) } style={{ cursor: "pointer" }} />
                        : ""
                      }
                    </Grid>
                    <Field name={`descriptions.${index}.description`}>
                      {({ field }) => (
                        <TextField
                        fullWidth
                        label="Suggestion"
                        multiline
                        maxRows={4}
                        disabled={descDisArr[index]}
                        autoFocus
                        {...field}
                        error={descriptionsErrors.description && descriptionsTouched.description ? true: false}
                        helperText={(descriptionsErrors.description && descriptionsTouched.description ? 'Description is required!' : '')}
                        />
                      )}
                    </Field>
                  </div>
                  )
                }))}
              </FieldArray>
              <Stack spacing={2} direction="row" sx={{ mt: 3 }}>
                <Button type="submit" variant="contained" disabled={submitting}>Save</Button>
              </Stack>      
            </Form>
            )}
          </Formik>
          </TabPanel>
        </TabContext>
        <Snackbar open={saveDatatost} autoHideDuration={3000} onClose={handleClose}>
        <Alert
          onClose={handleClose}
          severity="success"
          variant="filled"
          sx={{ width: '100%' }}
        >
          Suggestion updated successfully
        </Alert>
      </Snackbar>
      </Paper>
    </Box>
  );
}



