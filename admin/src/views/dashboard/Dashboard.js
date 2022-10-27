import React,{ useState,useEffect} from "react";
import {
    Row,
    Col,
    Card,
    CardBody,
} from 'reactstrap';
import "react-table/react-table.css";
import { UserService } from "../../jwt/_services";



const Dashboard = () => {
    const [count,setCount] = useState('.');
    function getUserCount(){
        UserService.getUserCount().then(res => {
            setCount(res.count);
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
