<?php
/**
 * 首页控制器
 *
 * @author linzequan <lowkey361@gmail.com>
 *
 */
class home extends MY_Controller {

    public function __construct() {
        parent::__construct();
        $data['resource_url'] = $this->resource_url;
        $data['base_url'] = $this->config->item('base_url');
        $this->data = $data;
    }


    public function index() {
        echo 'hello';
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
