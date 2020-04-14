<?php
/**
 * 应用基础模型
 *
 * @author linzequan <lowkey361@gmail.com>
 *
 */
class MY_Model extends CI_Model {

    public function __construct(){
        parent::__construct();
        $this->loginInfo = isset($_SESSION['loginInfo']) ? $_SESSION['loginInfo'] : '';
        // $this->loginInfo = $this->session->userdata('loginInfo');
    }


    /**
     * 标准化返回结果
     *
     * @param string $success
     * @param number $error
     * @param mixed $data
     * @return string array(success=>false,error=>0,data=>'')
     */
    protected function create_result($success=false, $error=0, $data='') {
        return array('success'=>$success, 'error'=>$error, 'data'=>$data);
        exit;
    }
}
