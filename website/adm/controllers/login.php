<?php
/**
 * 后台登录控制器
 *
 * @author linzequan <lowkey361@gmail.com>
 *
 */
class Login extends MY_Controller {

    public function __construct() {
        parent::__construct();
        $this->load->model('admin_model');
        $this->data['resource_url'] = $this->resource_url;
    }


    public function index() {
        $this->load->view('login', $this->data);
    }


    public function get() {
        $actionxm = $this->get_request('actionxm');
        $result = array();
        switch($actionxm) {
        }
        echo json_encode($result);
    }

    public function post() {
        $actionxm = $this->get_request('actionxm');
        $result = array();
        switch($actionxm) {
            case 'login':
                $username = $this->get_request('username');
                $password = $this->get_request('password');
                $result = $this->admin_model->doLogin($username, $password);
                break;
            case 'logout':
                $result = $this->admin_model->doLogout();
                break;
        }
        echo json_encode($result);
    }
}
