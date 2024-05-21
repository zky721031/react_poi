import { useNavigate, Navigate } from 'react-router-dom';
import { Button, Checkbox, Form, Input, message } from 'antd';
import { http, setCookies, getCookies } from '../../utils';

export default function Login() {
  const isToken = getCookies('authToken');
  const navigate = useNavigate();

  const onFinish = async (values) => {
    try {
      const {
        data: { results },
      } = await http.post('/user/myfleet-web-login', {
        account: values.username,
        password: values.password,
      });
      const {
        token,
        personal_setting,
        // personal_setting: { unit },
      } = results;
      setCookies('authToken', token);
      setCookies('personal_setting', personal_setting);
      // setCookies('unit', unit);
      navigate('/landmarkManagement');
      // this.$i18n.setLocale(results.personal_setting.language);
      // this.generalCookieSetting(results);
      // this.v3Routing(results);
      // this.account = '';
      // this.password = '';
    } catch (err) {
      console.log(err.response.data);
    }
  };
  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };

  // const loginHandler = () => {
  //   window.localStorage.setItem('auth', '123');
  //   navigate('/layout');
  // };
  if (isToken) {
    message.warning('您已登入過了');
    return <Navigate to='/layout' replace />;
  }
  return (
    <div>
      <header></header>
      <h1>Login Page</h1>
      <Form
        name='basic'
        labelCol={{
          span: 8,
        }}
        wrapperCol={{
          span: 16,
        }}
        style={{
          maxWidth: 600,
        }}
        initialValues={{
          remember: true,
        }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        autoComplete='off'
      >
        <Form.Item
          label='Username'
          name='username'
          rules={[
            {
              required: true,
              message: 'Please input your username!',
            },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label='Password'
          name='password'
          rules={[
            {
              required: true,
              message: 'Please input your password!',
            },
          ]}
        >
          <Input.Password />
        </Form.Item>

        <Form.Item
          name='remember'
          valuePropName='checked'
          wrapperCol={{
            offset: 8,
            span: 16,
          }}
        >
          <Checkbox>Remember me</Checkbox>
        </Form.Item>

        <Form.Item
          wrapperCol={{
            offset: 8,
            span: 16,
          }}
        >
          <Button type='primary' htmlType='submit'>
            Submit
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}
