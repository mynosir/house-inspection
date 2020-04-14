<?php
/**
 * 应用基础模型（初始化分库访问）
 *
 * @author linzequan <lowkey361@gmail.com>
 *
 */
class MY_Model extends CI_Model {

    /**
     * 初始化分库访问静态变量
     */
    public function __construct(){
        parent::__construct();
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
     * 发起https请求(cloudbeds专用)
     * @param  [type] $url  [description]
     * @param  [type] $data [description]
     * @return [type]       [description]
     */
    public function https_request_cloudbeds($url, $access_token, $data=null, $httpBuildQuery=false) {
        $curl = curl_init();
        // $access_token = 'FkqeKbMe7vZxyc9Ymoanc5YoRuFD1MC9QDk2ojvR';
        curl_setopt($curl, CURLOPT_URL, $url);
        curl_setopt($curl, CURLOPT_SSL_VERIFYPEER, FALSE);
        curl_setopt($curl, CURLOPT_SSL_VERIFYHOST, FALSE);
        curl_setopt($curl, CURLOPT_HTTPHEADER, array('Authorization: Bearer '. $access_token));
        if(!empty($data)) {
            if(!!$httpBuildQuery) $data = http_build_query($data);
            curl_setopt($curl, CURLOPT_POST, 1);
            curl_setopt($curl, CURLOPT_POSTFIELDS, $data);
        }
        curl_setopt($curl, CURLOPT_RETURNTRANSFER, 1);
        $output = json_decode(curl_exec($curl), true);
        curl_close($curl);
        return $output;
    }
}
