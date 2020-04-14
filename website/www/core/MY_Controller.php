<?php
/**
 * 应用基础控制器
 *
 * @author linzequan <lowkey361@gmail.com>
 *
 */
class MY_Controller extends CI_Controller {

    public function __construct() {
        parent::__construct();
        $this->resource_url = $this->config->item('base_url') . 'www/views/';
        $this->load->config('customer');
        $this->wechat = $this->config->item('wechat');
    }


    /**
     * 显示页面，自动加上头部和尾部
     * @param  [type] $page [description]
     * @param  [type] $data [description]
     * @return [type]       [description]
     */
    public function showPage($page, $data) {
        $this->load->view('include/_header', $data);
        $this->load->view($page, $data);
        $this->load->view('include/_footer', $data);
    }


    /**
     * 发起https请求
     * @param  [type] $url  [description]
     * @param  [type] $data [description]
     * @return [type]       [description]
     */
    public function https_request($url, $data=null) {
        $curl = curl_init();
        curl_setopt($curl, CURLOPT_URL, $url);
        curl_setopt($curl, CURLOPT_SSL_VERIFYPEER, FALSE);
        curl_setopt($curl, CURLOPT_SSL_VERIFYHOST, FALSE);
        if(!empty($data)) {
            curl_setopt($curl, CURLOPT_POST, 1);
            curl_setopt($curl, CURLOPT_POSTFIELDS, $data);
        }
        curl_setopt($curl, CURLOPT_RETURNTRANSFER, 1);
        $output = curl_exec($curl);
        curl_close($curl);
        return $output;
    }


    /**
     * 发起http请求
     * @param  [type] $url  [description]
     * @param  [type] $data [description]
     * @return [type]       [description]
     */
    public function http_post($url, $data=null) {
        $curl = curl_init();
        curl_setopt($curl, CURLOPT_URL, $url);
        if(!empty($data)) {
            curl_setopt($curl, CURLOPT_POST, 1);
            curl_setopt($curl, CURLOPT_POSTFIELDS, $data);
        }
        curl_setopt($curl, CURLOPT_RETURNTRANSFER, 1);
        $output = curl_exec($curl);
        curl_close($curl);
        return $output;
    }


    /**
     * 获取用户请求ip地址
     * @return [type] [description]
     */
    public function getIP() {
        $ip = '0.0.0.0';
        if(isset($_SERVER['HTTP_X_REAL_IP'])) {
            // nginx 代理模式下，获取客户端真实ip
            $ip = $_SERVER['HTTP_X_REAL_IP'];
        } elseif(isset($_SERVER['HTTP_CLIENT_IP'])) {
            // 客户端的ip
            $ip = $_SERVER['HTTP_CLIENT_IP'];
        } elseif(isset($_SERVER['HTTP_X_FORWARDED_FOR'])) {
            // 浏览当前页面的用户计算机的网关
            $arr = explode(',', $_SERVER['HTTP_X_FORWARDED_FOR']);
            $pos = array_search('unknown', $arr);
            if(false!==$pos) unset($arr[$pos]);
            $ip = trim($arr[0]);
        } elseif(isset($_SERVER['REMOTE_ADDR'])) {
            // 浏览当前页面的用户计算机的ip地址
            $ip = $_SERVER['REMOTE_ADDR'];
        } else {
            $ip = $_SERVER['REMOTE_ADDR'];
        }
        return $ip;
    }


    /**
     * 标准化请求输出
     *
     * @param boolean $success 操作是否成功
     * @param integer $error 操作错误编码
     * @param mixed $data 操作错误提示或结果数据输出
     * @return string {success:false, error:0, data:''}
     */
    public function output_result($success=false, $error=0, $data='') {
        if(is_array($success)==true) {
            echo json_encode($success);
        } else {
            echo json_encode(array('success'=>$success, 'error'=>$error, 'data'=>$data));
        }
        exit;
    }


    public function get_request($key, $default='') {
        return get_value($_REQUEST, $key, $default);
    }
}
