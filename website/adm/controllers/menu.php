<?php
/**
 * 系统菜单控制器
 *
 * @author linzequan <lowkey361@gmail.com>
 *
 */
class Menu extends MY_Controller {

    public function __construct() {
        parent::__construct();
        $this->checkLogin();
        $this->load->model('menu_model');
        $data['resource_url'] = $this->resource_url;
        $data['admin_info'] = isset($_SESSION['loginInfo']) ? $_SESSION['loginInfo'] : '';
        // $data['admin_info'] = $this->session->userdata('loginInfo');
        $data['base_url'] = $this->config->item('base_url');
        $data['current_menu'] = 'menu';
        $data['current_menu_text'] = '菜单管理';
        $data['sub_menu'] = array();
        $data['menu_list'] = $this->getMenuList();
        $this->data = $data;
    }


    public function index() {
        $this->showPage('menu_index', $this->data);
    }


    public function get() {
        $actionxm = $this->get_request('actionxm');
        $result = array();
        switch($actionxm) {
            case 'search':
                $result = $this->menu_model->search();
                break;
            case 'detail':
                $id = $this->get_request('id');
                $result = $this->menu_model->getMenuById($id);
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
                $result = $this->menu_model->add($params);
                break;
            case 'update':
                $id = $this->get_request('id');
                $params = $this->get_request('params');
                $result = $this->menu_model->update($params, array('id'=> $id));
                break;
            case 'delete':
                $id = $this->get_request('id');
                $result = $this->menu_model->delete($id);
                break;
        }
        echo json_encode($result);
    }
}
