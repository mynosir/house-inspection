<?php
/**
 * 后台用户管理模型
 *
 * @author linzequan <lowkey361@gmail.com>
 *
 */
class Admin_model extends MY_Model {

    public function __construct() {
        parent::__construct();
        $this->table = 'sys_admin';
        $this->fields = 'id, username, realname, telephone, email, password, role_id, is_admin, status, create_time, update_time, create_userid, update_userid';
        // $this->loginInfo = $this->session->userdata('loginInfo');
		$this->loginInfo = isset($_SESSION['loginInfo']) ? $_SESSION['loginInfo'] : '';
    }


    /**
     * 登录
     * @param  string $username 用户名
     * @param  string $password 密码
     * @return [type]           [description]
     */
    public function doLogin($username='', $password='') {
        if($username=='' || $password=='') {
            $result['status'] = -1;
            $result['msg'] = '用户名或者密码不能为空！';
            return $result;
        }
        $where = array(
            'username'  => $username,
            'password'  => md5($password)
        );
        $query = $this->db->where($where)->get($this->table);
        $userinfo = $query->result_array();
        if(count($userinfo) > 0) {
            $result['status'] = 0;
            $result['msg'] = '登录成功！';
			$_SESSION['loginInfo'] = $userinfo[0];
            // $this->session->set_userdata('loginInfo', $userinfo[0]);
            return $result;
        } else {
            $result['status'] = -2;
            $result['msg'] = '用户名或者密码错误';
            return $result;
        }
    }


    /**
     * 退出
     * @return [type] [description]
     */
    public function doLogout() {
		$_SESSION['loginInfo'] = '';
        // $this->session->set_userdata('loginInfo', '');
        $result['status'] = 0;
        $result['msg'] = '退出成功！';
        return $result;
    }


    /**
     * 添加后台用户
     * @param [type] $params [description]
     */
    public function add($params) {

        $data = array(
            'username'      => trim($params['username']),
            'realname'      => trim($params['realname']),
            'telephone'     => trim($params['telephone']),
            'email'         => trim($params['email']),
            'password'      => md5(trim($params['password'])),
            'role_id'       => $params['role_id'],
            'is_admin'      => $params['is_admin'],
            'create_time'   => time(),
            'create_userid' => $this->loginInfo['id']
        );

        // 校验数据
        if(!$data['username']) {
            $result['status'] = -1;
            $result['msg'] = '用户名不能为空！';
            return $result;
        }
        if(!$data['password']) {
            $result['status'] = -1;
            $result['msg'] = '密码不能为空！';
            return $result;
        }
        if(strlen(trim($params['password'])) < 6) {
            $result['status'] = -1;
            $result['msg'] = '密码至少为6位数！';
            return $result;
        }
        if(!$data['realname']) {
            $result['status'] = -1;
            $result['msg'] = '姓名不能为空！';
            return $result;
        }
        if($data['role_id']=='') {
            $result['status'] = -1;
            $result['msg'] = '角色不能为空！';
            return $result;
        }
        if($data['is_admin']=='') {
            $result['status'] = -1;
            $result['msg'] = "请选择是否为超级管理员";
            return $result;
        }
        if($data['telephone']!='' && !preg_match('/^1[34578]{1}\d{9}$/', $data['telephone'])) {
            $result['status'] = -1;
            $result['msg'] = '手机号码格式不正确！';
            return $result;
        }
        if($data['email']!='' && !preg_match('/^\\w+((-\\w+)|(\\.\\w+))*\\@[A-Za-z0-9]+((\\.|-)[A-Za-z0-9]+)*\\.[A-Za-z0-9]+$/', $data['email'])) {
            $result['status'] = -1;
            $result['msg'] = '邮箱格式不正确！';
            return $result;
        }
        if($this->isExist($data['username'])) {
            $result['status'] = -1;
            $result['msg'] = '用户名已经存在！';
            return $result;
        }

        $this->db->insert($this->table, $data);
        return array(
            'status'    => 0,
            'msg'       => '操作成功！'
        );

    }


    /**
     * 判断管理员是否存在
     * @param  [type]  $username [description]
     * @return boolean           [description]
     */
    public function isExist($username) {
        $query = $this->db->select('count(1) as num')->where(array('username'=> $username))->get($this->table);
        $result = $query->result_array();
        $num = $result[0]['num'];
        if($num > 0) {
            return true;
        } else {
            return false;
        }
    }


    /**
     * 修改密码
     * @param  [type] $password_old [description]
     * @param  [type] $password_new [description]
     * @return [type]               [description]
     */
    public function changePwd($password_old, $password_new) {

        // 判断密码是否正确
        $where = array(
            'username'  => trim($this->loginInfo['username']),
            'password'  => md5(trim($password_old))
        );
        if(strlen(trim($password_new)) < 6) {
            $result['status'] = -1;
            $result['msg'] = '密码至少为6位数！';
            return $result;
        }
        $query = $this->db->select('count(1) as num')->where($where)->get($this->table);
        $result = $query->result_array();
        if($result[0]['num'] > 0) {
            $this->db->query('update ' . $this->table . ' set password = "' . md5($password_new) . '" where id=' . $this->loginInfo['id']);
            return array(
                'status'    => 0,
                'msg'       => '操作成功！'
            );
        } else {
            return array(
                'status'    => -1,
                'msg'       => '旧密码错误！'
            );
        }

    }


    /**
     * 更新后台用户信息
     * @param  [type] $params [description]
     * @param  [type] $where  [description]
     * @return [type]         [description]
     */
    public function update($params, $where) {
        $data = array(
            'realname'      => trim($params['realname']),
            'telephone'     => trim($params['telephone']),
            'email'         => trim($params['email']),
            'role_id'       => $params['role_id'],
            'is_admin'      => $params['is_admin'],
            'update_time'   => time(),
            'update_userid' => $this->loginInfo['id']
        );
        // 判断是否需要变更密码
        $adminInfo = $this->getAdminById($where['id']);
        if($adminInfo['data']['password'] != $params['password']) {
            $data['password'] = md5(trim($params['password']));
            if(strlen(trim($params['password'])) < 6) {
                $result['status'] = -1;
                $result['msg'] = '密码至少为6位数！';
                return $result;
            }
        }

        // 校验数据
        if(isset($data['password']) && !$data['password']) {
            $result['status'] = -1;
            $result['msg'] = '用户名不能为空！';
            return $result;
        }
        if(!$data['realname']) {
            $result['status'] = -1;
            $result['msg'] = '姓名不能为空！';
            return $result;
        }
        if($data['role_id']=='') {
            $result['status'] = -1;
            $result['msg'] = '角色不能为空！';
            return $result;
        }
        if($data['is_admin']=='') {
            $result['status'] = -1;
            $result['msg'] = "请选择是否为超级管理员！";
            return $result;
        }
        if($data['telephone']!='' && !preg_match('/^1[34578]{1}\d{9}$/', $data['telephone'])) {
            $result['status'] = -1;
            $result['msg'] = '手机号码格式不正确！';
            return $result;
        }
        if($data['email']!='' && !preg_match('/^\\w+((-\\w+)|(\\.\\w+))*\\@[A-Za-z0-9]+((\\.|-)[A-Za-z0-9]+)*\\.[A-Za-z0-9]+$/', $data['email'])) {
            $result['status'] = -1;
            $result['msg'] = '邮箱格式不正确！';
            return $result;
        }

        $this->db->where($where)->update($this->table, $data);
        return array(
            'status'    => 0,
            'msg'       => '操作成功！'
        );

    }


    /**
     * 删除后台用户
     * @param  [type] $id [description]
     * @return [type]     [description]
     */
    public function delete($id) {

        $this->db->where(array('id'=> $id))->update($this->table, array('status'=> 1));
        return array(
            'status'    => 0,
            'msg'       => '操作成功！'
        );

    }


    /**
     * 根据后台用户ID获取用户信息
     * @param  [type] $id [description]
     * @return [type]     [description]
     */
    public function getAdminById($id) {

        $query = $this->db->query('select ' . $this->fields . ' from ' . $this->table . ' where `id`=' . $id);
        $result = $query->result_array();
        return array(
            'status'    => 0,
            'msg'       => '操作成功！',
            'data'      => $result[0]
        );
    }


    /**
     * 分页获取后台用户列表
     * @param  integer $page    [description]
     * @param  integer $size    [description]
     * @param  string  $keyword [description]
     * @return [type]           [description]
     */
    public function getAdminByPage($page=1, $size=20, $keywords) {

        $result = array();
        $keywordArr = array();
        if($keywords['username'] != '') {
            $keywordArr[] = ' `username` like "%' . $keywords['username'] . '%" ';
        }
        if($keywords['realname'] != '') {
            $keywordArr[] = ' `realname` like "%' . $keywords['realname'] . '%" ';
        }
        if($keywords['telephone'] != '') {
            $keywordArr[] = ' `telephone` like "%' . $keywords['telephone'] . '%" ';
        }
        if(count($keywordArr) > 0) {
            $keyword = implode(' or ', $keywordArr);
            $where = ' where (' . $keyword . ') and `status`=0 ';
        } else {
            $where = ' where `status`=0 ';
        }
        $limitStart = ($page - 1) * $size;
        $query = $this->db->query('select ' . $this->fields . ' from ' . $this->table . $where . ' order by create_time desc limit ' . $limitStart . ', ' . $size);
        $result = $query->result_array();
        $this->load->model('role_model');
        $CI = &get_instance();
        foreach($result as &$item) {
            if($item['role_id'] && $roleInfo = $CI->role_model->getRoleById($item['role_id'])) {
                $item['rolename'] = $roleInfo['data']['name'];
            } else {
                $item['rolename'] = '';
            }
            if($item['create_userid'] && $userinfo = $CI->admin_model->getAdminById($item['create_userid'])) {
                $item['create_user'] = $userinfo['data']['username'];
            } else {
                $item['create_user'] = '';
            }
            if($item['update_userid'] && $userinfo = $CI->admin_model->getAdminById($item['update_userid'])) {
                $item['update_user'] = $userinfo['data']['username'];
            } else {
                $item['update_user'] = '';
            }
            if($item['create_time']) {
                $item['create_time'] = date('Y-m-d H:i:s', $item['create_time']);
            } else {
                $item['create_time'] = '';
            }
            if($item['update_time']) {
                $item['update_time'] = date('Y-m-d H:i:s', $item['update_time']);
            } else {
                $item['update_time'] = '';
            }
        }
        $pageQuery = $this->db->query('select count(1) as num from ' . $this->table . $where);
        $pageResult = $pageQuery->result_array();
        $num = $pageResult[0]['num'];
        return array(
            'status'=> 0,
            'msg'   => '操作成功！',
            'data'  => array(
                'total' => $num,
                'size'  => $size,
                'page'  => $page,
                'list'  => $result
            )
        );

    }


    /**
     * 查询管理员详细信息
     * @param  [type] $id [description]
     * @return [type]     [description]
     */
    public function getAdminDetailInfo($id) {

        $query = $this->db->query('select ' . $this->fields . ' from ' . $this->table . ' where `id`=' . $id);
        $result = $query->result_array();
        if(count($result) > 0) {
            $info = $result[0];
            $this->load->model('role_model');
            $CI = &get_instance();
            if($info['role_id'] > 0) {
                // 查询角色信息
                $roleInfo = $CI->role_model->getRoleById($info['role_id']);
                $info['roleInfo'] = $roleInfo['data'];
                // 查询权限信息
                $pms = explode(',', $info['roleInfo']['pms']);
                $pmsName = array();
                $this->load->model('menu_model');
                foreach($pms as $v) {
                    if($v != '') {
                        $menuInfo = $CI->menu_model->getMenuById($v);
                        $pmsName[] = $menuInfo['data']['name'];
                    }
                }
                $info['roleInfo']['pmsName'] = implode('，', $pmsName);
            } else {
                $info['roleInfo'] = array();
            }
        }
        return $info;

    }

    // 查询是否有未处理的城市
    public function checkUpdatedCity(){
      $sql = 'select * from ko_cloudbeds_city where status=0';
      $res = $this->db->query($sql)->result_array();
      if(count($res)>0){
        $result = true;
      }else{
        $result = false;
      }
      return $result;
    }

    // 查询是否有未读的酒店房间翻译
    public function checkUnreadRoom(){
      $sql = 'select * from ko_cloudbeds_roomtypes_log where status=0';
      $res = $this->db->query($sql)->result_array();
      if(count($res)>0){
        $result = true;
      }else{
        $result = false;
      }
      return $result;
    }
}
