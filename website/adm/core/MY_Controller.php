<?php
/**
 * 应用基础控制器
 *
 * @author linzequan <lowkey361@gmail.com>
 *
 */
class MY_Controller extends CI_Controller {

    public $ctrl_name='';
    public $ctrl_pms='';
    public $resource_url;

    public function __construct() {
        parent::__construct();
        $this->resource_url = $this->config->item('base_url') . 'adm/views/static/';
        $this->load->config('customer');
        $this->wechat = $this->config->item('wechat');
        // $this->getAccessToken();
    }


    /**
     * 判断浏览器是否IE
     * @return boolean [description]
     */
    public function isIE() {
        $userbrowser = $_SERVER['HTTP_USER_AGENT'];
        if(preg_match('/MSIE/i', $userbrowser)) {
            return 'yes';
        } else {
            return 'no';
        }
    }


    /**
     * 发送https请求
     * @param  [type] $url  [description]
     * @param  [type] $data [description]
     * @return [type]       [description]
     */
    public function https_post($url, $data) {
        $curl = curl_init();
        curl_setopt($curl, CURLOPT_URL, $url);
        curl_setopt($curl, CURLOPT_SSL_VERIFYPEER, FALSE);
        curl_setopt($curl, CURLOPT_SSL_VERIFYHOST, FALSE);
        curl_setopt($curl, CURLOPT_POST, 1);
        curl_setopt($curl, CURLOPT_POSTFIELDS, $data);
        curl_setopt($curl, CURLOPT_RETURNTRANSFER, 1);
        $result = curl_exec($curl);
        if(curl_errno($curl)) {
           return 'Errno' . curl_error($curl);
        }
        curl_close($curl);
        return $result;
    }


    public function getMenuList() {
        $this->load->model('menu_model');
        $this->load->model('role_model');
        $list = $this->menu_model->search();
        $result = array(
            'sysMenu'   => 0,
            'appMenu'   => array()
        );
        // 获取当前角色
        // $userinfo = $this->session->userdata('loginInfo');
        $userinfo = isset($_SESSION['loginInfo']) ? $_SESSION['loginInfo'] : '';
        if($userinfo && $userinfo['is_admin']=='1') {
            // 超管
            $result['sysMenu'] = 1;
            $result['appMenu'] = $list['data'];
        } else {
            $roleInfo = $this->role_model->getRoleById($userinfo['role_id']);
            $pmsArr = explode(',', $roleInfo['data']['pms']);
            foreach($list['data'] as $v) {
                if(in_array($v['id'], $pmsArr)) {
                    $result['appMenu'][] = $v;
                }
            }
        }
        return $result;
    }


    public function showPage($page, $data) {
        $this->load->view('include/_header', $data);
        $this->load->view($page, $data);
        $this->load->view('include/_footer', $data);
    }


    public function checkLogin() {
        // $userinfo = $this->session->userdata('loginInfo');
        $userinfo = isset($_SESSION['loginInfo']) ? $_SESSION['loginInfo'] : '';
        if($userinfo == '') {
            header('Location: /adm/login/index');
            exit;
        }
        /*if(!$this->session->userdata('loginInfo')) {
            header('Location: /adm/login/index');
            exit;
        }*/
    }


    public function get_request($key='', $default='') {
        if($key!='') {
            return get_value($_REQUEST, $key, $default);
        } else {
            return $_REQUEST;
        }
    }


    /**
     * 压缩图片
     * @param  [type] $imgsrc  [description]
     * @param  [type] $imgdest [description]
     * @return [type]          [description]
     */
    public function compressImage($imgsrc, $imgdest, $widthLimit=800) {
        list($width, $height, $type) = getimagesize($imgsrc);
        $newWidth = $width > $widthLimit ? $widthLimit : $width;
        $newHeight = $height * ($newWidth / $width);
        switch($type) {
            case 1:
                $giftype = $this->checkGif($imgsrc);
                if($giftype) {
                    $image_wp = imagecreatetruecolor($newWidth, $newHeight);
                    $image = imagecreatefromgif($imgsrc);
                    imagecopyresampled($image_wp, $image, 0, 0, 0, 0, $newWidth, $newHeight, $width, $height);
                    imagejpeg($image_wp, $imgdest, 75);
                    imagedestroy($image_wp);
                }
                break;
            case 2:
                $image_wp = imagecreatetruecolor($newWidth, $newHeight);
                $image = imagecreatefromjpeg($imgsrc);
                imagecopyresampled($image_wp, $image, 0, 0, 0, 0, $newWidth, $newHeight, $width, $height);
                imagejpeg($image_wp, $imgdest, 75);
                imagedestroy($image_wp);
                break;
            case 3:
                $image_wp = imagecreatetruecolor($newWidth, $newHeight);
                $image = imagecreatefrompng($imgsrc);
                imagecopyresampled($image_wp, $image, 0, 0, 0, 0, $newWidth, $newHeight, $width, $height);
                imagejpeg($image_wp, $imgdest, 75);
                imagedestroy($image_wp);
                break;
        }
        return;
    }

}
