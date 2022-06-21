import React, {
    useState
} from "react";
import {
    Card,
    CardBody,
    CardTitle,
    Form,
    FormGroup,
    Label,
    Input,
    InputGroup,
    InputGroupAddon,
    InputGroupText,
    Col,
    Button
} from 'reactstrap';
import { AuthenticationService } from "../../jwt/_services";

const ChangePassword = () => {
    const [oldPassword,updateOldPassword] = useState('');
    const [password,updatePassword] = useState('');
    const [repassword,updateRepassword] = useState('');
    const [responseMessage,setResponseMessage] = useState({success:null,message:''});
    const changePassword=(e)=>{
        e.preventDefault();
        AuthenticationService.changePassword(oldPassword, password).then(
            (user) => {
                setResponseMessage({success:true,message:"Password changed successfully"});
                updatePassword('');
                updateRepassword('');
                updateOldPassword('');
                setTimeout(()=>{
                    setResponseMessage({success:null,message:""});
                },2000)
            },
            (error) => {
                setResponseMessage({success:false,message:error.message});
                updatePassword('');
                updateRepassword('');
                updateOldPassword('');
                setTimeout(()=>{
                    setResponseMessage({success:null,message:""});
                },2000)
            }
        );
    } 
    return (
        <Card>
        <CardTitle className="bg-light border-bottom p-3 mb-0">
            <i className="mdi mdi-key mr-2"></i>Change Password
        </CardTitle>
        <CardBody>
            <Col md="6">
                <Form onSubmit={changePassword}>
                    <FormGroup>
                        <Label>Old Password</Label>
                        <InputGroup>
                            <Input 
                                invalid={oldPassword.length && oldPassword.length<=3} 
                                valid={oldPassword.length>=8} 
                                value={oldPassword} 
                                type="password" 
                                placeholder="Old Password"
                                onChange={(e)=>updateOldPassword(e.target.value)}
                            />
                            <InputGroupAddon addonType="append">
                                <InputGroupText>
                                    <i className="ti-lock"></i>
                                </InputGroupText>
                            </InputGroupAddon>
                        </InputGroup>
                    </FormGroup>
                    <FormGroup>
                        <Label>New Password</Label>
                        <InputGroup>
                            <Input 
                                invalid={password.length && password.length<=3} 
                                valid={password.length>=8} 
                                value={password} 
                                type="password" 
                                placeholder="Password"
                                onChange={(e)=>updatePassword(e.target.value)}
                            />
                            <InputGroupAddon addonType="append">
                                <InputGroupText>
                                    <i className="ti-lock"></i>
                                </InputGroupText>
                            </InputGroupAddon>
                        </InputGroup>
                    </FormGroup>
                    <FormGroup>
                        <Label>Confirm Password</Label>
                        <InputGroup>
                            <Input 
                                invalid={password.length && password!==repassword} 
                                valid={password.length && password===repassword} 
                                value={repassword} 
                                type="password" 
                                onChange={(e)=>updateRepassword(e.target.value)}
                                placeholder="Confirm Password" />
                            <InputGroupAddon addonType="append">
                                <InputGroupText>
                                    <i className="ti-lock"></i>
                                </InputGroupText>
                            </InputGroupAddon>
                        </InputGroup>
                    </FormGroup>
                    <div className="pt-3 mt-3">
                        <Button disabled={password.length<8 || password!==repassword}
                        type="submit" className="btn btn-success mr-2">Change Password</Button>
                    </div>
                    <br/>
                    {responseMessage.message && (
                        <div className={"alert "+(responseMessage.success?"alert-success":"alert-danger")}>{responseMessage.message}</div>
                    )}
                </Form>
            </Col>
        </CardBody>
    </Card>
    );
}

export default ChangePassword;
