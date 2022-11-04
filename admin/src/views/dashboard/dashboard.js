import React,{ useState,useEffect} from "react";
import {
    Row,
    Col,
    Card,
    CardBody,
} from 'reactstrap';
import "react-table/react-table.css";
import { UserService } from "../../shared/_services";
import { useSnackbar } from 'notistack';


const Dashboard = () => {
    const [count,setCount] = useState('.');
    const { enqueueSnackbar } = useSnackbar();
    function getUserCount(){
        UserService.getUserCount(enqueueSnackbar).then(response => {
            if (!response.error) {
                setCount(response.count);
              } else if (response.error.statusCode ===  400 ) {
                let variant = 'error';
                enqueueSnackbar("Something went worng", { variant });
              }
        })
    }
    useEffect(()=>{
      getUserCount();
    },[])
    return (
        <Card>
          <Row className="mt-2 ml-4">
            <Col lg="3" md="6">
                  <Card>
                      <CardBody>
                          <div className="d-flex flex-row">
                              <div className="round round-lg align-self-center round-warning">
                                  <i className="mdi mdi-account-multiple" />
                              </div>
                              <div className="ml-2 align-self-center">
                                  <h3 className="mb-0 font-lgiht">{count}</h3>
                                  <h5 className="text-muted mb-0">Total Users</h5>
                              </div>
                          </div>
                      </CardBody>
                  </Card>
            </Col>
          </Row>
        </Card >
    );
}

export default Dashboard;
