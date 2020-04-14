<?php
/**
 * 用户管理控制器
 *
 * @author linzequan <lowkey361@gmail.com>
 *
 */
class Admin extends MY_Controller {

    public function __construct() {
        parent::__construct();
        $this->checkLogin();
        $this->load->model('admin_model');
        $data['resource_url'] = $this->resource_url;
        $data['admin_info'] = isset($_SESSION['loginInfo']) ? $_SESSION['loginInfo'] : '';
        // $data['admin_info'] = $this->session->userdata('loginInfo');
        $data['base_url'] = $this->config->item('base_url');
        $data['current_menu'] = 'admin';
        $data['current_menu_text'] = '用户管理';
        $data['sub_menu'] = array();
        $data['menu_list'] = $this->getMenuList();
        $this->data = $data;
    }


    public function index() {
        $this->showPage('admin_index', $this->data);
    }


    public function get() {
        $actionxm = $this->get_request('actionxm');
        $result = array();
        switch($actionxm) {
            case 'search':
                $page = $this->get_request('page');
                $size = $this->get_request('size');
                $keywords = $this->get_request('keywords');
                $result = $this->admin_model->getAdminByPage($page, $size, $keywords);
                break;
            case 'detail':
                $id = $this->get_request('id');
                $result = $this->admin_model->getAdminById($id);
                break;
        }
        echo json_encode($result);
    }


    public function post() {
        $actionxm = $this->get_request('actionxm');
        $result = array();
        switch($actionxm) {
            case 'add':
                $params = $this->get_request('params');
                $result = $this->admin_model->add($params);
                break;
            case 'update':
                $id = $this->get_request('id');
                $params = $this->get_request('params');
                $result = $this->admin_model->update($params, array('id'=> $id));
                break;
            case 'delete':
                $id = $this->get_request('id');
                $result = $this->admin_model->delete($id);
                break;
            case 'changePwd':
                $password_old = $this->get_request('password_old');
                $password_new = $this->get_request('password_new');
                $result = $this->admin_model->changePwd($password_old, $password_new);
                break;
        }
        echo json_encode($result);
    }
}
