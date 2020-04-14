<?php
/**
 * 接口控制器
 *
 * @author linzequan <lowkey361@gmail.com>
 *
 */
class api extends MY_Controller {

    public function __construct() {
        parent::__construct();
        $data['resource_url'] = $this->resource_url;
        $data['base_url'] = $this->config->item('base_url');
        $this->data = $data;
        header("Access-Control-Allow-Origin: *");
        header("Access-Control-Allow-Methods:POST,GET");
        header("Access-Control-Allow-Headers:x-requested-with,content-type");
        header("Content-type:text/json;charset=utf-8");
    }


    public function index() {
        echo 'hello api';
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
