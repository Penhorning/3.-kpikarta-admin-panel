import React,{ useState,useEffect} from "react";
import {
    Row,
    Col,
    Card,
    Badge,
    CardBody,
} from 'reactstrap';
import { BootstrapTable, TableHeaderColumn } from "react-bootstrap-table";
import { UserService } from "../../jwt/_services";
import '../../assets/scss/login.css'
import 'react-bootstrap-table/dist/react-bootstrap-table-all.min.css';

const Users = () => {
    const [users,setUsers] = useState([]);
    const onAfterDeleteRow = function (rowKeys) {
      alert("The rowkey you drop: " + rowKeys);
    }
    const afterSearch = function (searchText, result) {
    }
    const options = {
      afterDeleteRow: onAfterDeleteRow,
      afterSearch: afterSearch,
    };

    function filterVerified(verified){
      return verified?<Badge color="success" pill>VERIFIED</Badge>:<Badge color="success" pill>VERIFIED</Badge>
    }


    function getAllUsers(){
        UserService.getAll().then(allUsers => {
            setUsers(allUsers.map(u=>{
                return {
                    id: u.id,
                    fullName: u.fullName,
                    email: u.email,
                    emailVerified: function(){
                      return u.emailVerified?'VERIFIED':'UNVERIFIED';
                    }(),
                    createdAt: new Date(u.createdAt).toLocaleDateString(),
                    updatedAt: new Date(u.updatedAt).toLocaleDateString()
                    }
            }));
        })
    }
    useEffect(()=>{
      getAllUsers();
    },[])

    return (
      <div>
        <Row style={{paddingBottom:60}}>
          <Col md="12">
            <Card>
              <CardBody>
                <BootstrapTable
                  version='4'
                  striped
                  hover
                  search={true}
                  data={users}
                  pagination={true}
                  options={options}
                  // cellEdit={cellEditProp}
                  tableHeaderClass="mb-0"
                >
                  <TableHeaderColumn width="100" dataField="fullName">
                    Full Name
                  </TableHeaderColumn>
                  <TableHeaderColumn width="100" dataField="email" isKey>
                    Email
                  </TableHeaderColumn>
                  <TableHeaderColumn width="100" dataField="emailVerified">
                    Status
                  </TableHeaderColumn>
                  <TableHeaderColumn width="100" dataField="createdAt">
                    Created At
                  </TableHeaderColumn>
                  <TableHeaderColumn width="100" dataField="updatedAt">
                    Updated At
                  </TableHeaderColumn>
                </BootstrapTable>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </div>
    );
}

export default Users;
