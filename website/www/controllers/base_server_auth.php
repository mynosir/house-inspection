<?php
/**
 * 微信授权控制器
 *
 * @author linzequan <lowkey361@gmail.com>
 *
 */
class Base_server_auth extends MY_Controller {

    public function __construct() {
        parent::__construct();
    }

    public function index() {
        $jumpurl = $_GET['jumpurl']=='' ? $this->config->item('base_url') : $_GET['jumpurl'];
        $this->base_server_auth($_GET['code'], $jumpurl);
    }
}
