<?php
/**
 * 后台首页控制器
 *
 * @author linzequan <lowkey361@gmail.com>
 *
 */
class Index extends MY_Controller {

    public function __construct() {
        parent::__construct();
        $this->checkLogin();
        $data['resource_url'] = $this->resource_url;
        $data['admin_info'] = isset($_SESSION['loginInfo']) ? $_SESSION['loginInfo'] : '';
        // var_dump($_SESSION['loginInfo']);exit;
        // $data['admin_info'] = $this->session->userdata('loginInfo');
        $data['base_url'] = $this->config->item('base_url');
        $data['current_menu'] = 'index';
        $data['current_menu_text'] = 'Dashboard';
        $data['sub_menu'] = array();
        $data['menu_list'] = $this->getMenuList();
        $this->data = $data;
    }


    public function index() {
        $this->load->view('include/_header', $this->data);
        // 查询当前用户个人信息
        $adminId = $this->data['admin_info']['id'];
        $this->load->model('admin_model');
        $this->data['adminDetail'] = $this->admin_model->getAdminDetailInfo($adminId);
        // 查询系统信息
        $this->data['systemInfo'] = getSystemInfo();
        $this->load->view('index', $this->data);
        $this->load->view('include/_footer', $this->data);
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
        }
        echo json_encode($result);
    }
}
