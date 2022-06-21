import React,{ useState,useEffect} from "react";
import {
    Button,
    Row,
    Col,
    Card,
    CardBody,
    CardTitle,
    CardHeader,
} from 'reactstrap';
import ReactTable from "react-table";
import "react-table/react-table.css";
import { UserService } from "../../jwt/_services";

const Dashboard = () => {
    const [users,setUsers] = useState([]);
    function getAllUsers(){
        UserService.getAll().then(allUsers => {
            setUsers(allUsers.map(u=>{
                return {
                    id: u.id,
                    fullName: u.fullName,
                    email: u.email,
                    emailVerified: u.emailVerified?'TRUE':'FALSE',
                    createdAt: u.createdAt,
                    updatedAt: u.updatedAt,
                    actions: (
                      // we've added some custom button actions
                      <div className="text-center">
                        {/* use this button to add a edit kind of action */}
                        <Button
                          onClick={() => {
                          //   let obj = data2.find((o) => o.id === key);
                          //   setModal(!modal);
                          //   setObj(obj);
                          }}
                          color="success"
                          size="sm"
                          round="true"
                          icon="true"
                        >
                        <i className="fa-lg mdi mdi-pencil" />
                        </Button>
                        {/* use this button to remove the data row */}
                        {/* <Button
                            onClick={() => {
                              let newdata = data2;
                              newdata.find((o, i) => {
                                if (o.id === key) {
                                  newdata.splice(i, 1);
                                  console.log(newdata);
                                  return true;
                                }
                                return false;
                              });
                              this.setState({ jsonData: newdata });
                            }}
                            className="ml-1"
                            color="danger"
                            size="sm"
                            round="true"
                            icon="true"
                          >
                            <i className="fa fa-times" />
                          </Button> */}
                      </div>
                    )}
            }));
        })
    }
    useEffect(()=>{
        if (document.readyState === "complete") {
            getAllUsers();
        }
    },[])
    return (
        <Card>
            <CardHeader>
                <CardTitle><i className="mdi mdi-folder-account mr-2" style={{fontSize:22}}></i>USERS</CardTitle>
            </CardHeader>
            <CardBody>
                <Row>
                    <Col md="12">
                    <ReactTable
            columns={[
              {
                Header: "Full Name",
                accessor: "fullName",
              },
              {
                Header: "Email",
                accessor: "email",
              },
              {
                Header: "Email Verified",
                accessor: "emailVerified",
              },
              {
                Header: "Created At",
                accessor: "createdAt",
              },
              {
                Header: "Updated At",
                accessor: "updatedAt",
              },
              {
                Header: "Actions",
                accessor: "actions",
                sortable: false,
                filterable: false,
              },
            ]}
            defaultPageSize={10}
            showPaginationBottom={true}
            className="-striped -highlight"
            data={users}
            filterable
          />
                    </Col>
                </Row>
            </CardBody>
        </Card >
    );
}

export default Dashboard;
