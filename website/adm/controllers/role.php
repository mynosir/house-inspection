<?php
/**
 * 角色管理控制器
 *
 * @author linzequan <lowkey361@gmail.com>
 *
 */
class Role extends MY_Controller {

    public function __construct() {
        parent::__construct();
        $this->checkLogin();
        $this->load->model('role_model');
        $data['resource_url'] = $this->resource_url;
        $data['admin_info'] = isset($_SESSION['loginInfo']) ? $_SESSION['loginInfo'] : '';
        // $data['admin_info'] = $this->session->userdata('loginInfo');
        $data['base_url'] = $this->config->item('base_url');
        $data['current_menu'] = 'role';
        $data['current_menu_text'] = '角色管理';
        $data['sub_menu'] = array();
        $data['menu_list'] = $this->getMenuList();
        $this->data = $data;
    }


    public function index() {
        $this->showPage('role_index', $this->data);
    }


    public function add() {
        $this->load->model('menu_model');
        $searchData = $this->menu_model->search();
        $this->data['sys_menu'] = $searchData['data'];
        $this->showPage('role_edit', $this->data);
    }


    public function edit($id) {
        $this->load->model('menu_model');
        $searchData = $this->menu_model->search();
        $this->data['sys_menu'] = $searchData['data'];
        $this->data['roleId'] = $id;
        $roleInfo = $this->role_model->getRoleById($id);
        $this->data['roleInfo'] = $roleInfo['data'];
        $this->showPage('role_edit', $this->data);
    }


    public function get() {
        $actionxm = $this->get_request('actionxm');
        $result = array();
        switch($actionxm) {
            case 'search':
                $page = $this->get_request('page');
                $size = $this->get_request('size');
                $result = $this->role_model->getRoleByPage($page, $size);
                break;
            case 'detail':
                $id = $this->get_request('id');
                $result = $this->role_model->getRoleById($id);
                break;
            case 'getList':
                $result = $this->role_model->getRoleList();
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
                $result = $this->role_model->add($params);
                break;
            case 'update':
                $id = $this->get_request('id');
                $params = $this->get_request('params');
                $result = $this->role_model->update($params, array('id'=> $id));
                break;
            case 'delete':
                $id = $this->get_request('id');
                $result = $this->role_model->delete($id);
                break;
        }
        echo json_encode($result);
    }
}
