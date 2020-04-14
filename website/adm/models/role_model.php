<?php
/**
 * 角色管理模型
 *
 * @author linzequan <lowkey361@gmail.com>
 *
 */
class Role_model extends MY_Model {

    public function __construct() {
        parent::__construct();
        $this->table = 'sys_role';
        $this->table_admin = 'sys_admin';
        $this->fields = 'id, name, pms, create_time, update_time, create_userid, update_userid';
        $this->fields_admin = 'id, username, realname, telephone, email, password, role_id, is_admin, status, create_time, update_time, create_userid, update_userid';
        // $this->loginInfo = $this->session->userdata('loginInfo');
		$this->loginInfo = isset($_SESSION['loginInfo']) ? $_SESSION['loginInfo'] : '';
    }


    /**
     * 添加角色
     * @param [type] $params [description]
     */
    public function add($params) {

        $data = array(
            'name'          => $params['name'],
            'pms'           => $params['pms'],
            'create_time'   => time(),
            'create_userid' => $this->loginInfo['id']
        );
        $this->db->insert($this->table, $data);
        return array(
            'status'    => 0,
            'msg'       => '操作成功！'
        );

    }


    /**
     * 更新角色信息
     * @param  [type] $params [description]
     * @param  [type] $where  [description]
     * @return [type]         [description]
     */
    public function update($params, $where) {
        $data = array(
            'name'          => $params['name'],
            'pms'           => $params['pms'],
            'update_time'   => time(),
            'update_userid' => $this->loginInfo['id']
        );
        $this->db->where($where)->update($this->table, $data);
        return array(
            'status'    => 0,
            'msg'       => '操作成功！'
        );

    }


    /**
     * 删除角色
     * @param  [type] $id [description]
     * @return [type]     [description]
     */
    public function delete($id) {

        // 查询当前角色下是否有员工，有的话则不允许删除
        $query = $this->db->query('select count(1) as num from ' . $this->table_admin . ' where `role_id`=' . $id);
        $result = $query->result_array();
        if($result[0]['num'] > 0) {
            return array(
                'status'    => -2,
                'msg'       => '该角色存在用户，请先删除用户！'
            );
        }

        $this->db->delete($this->table, array('id'=> $id));
        return array(
            'status'    => 0,
            'msg'       => '操作成功！'
        );

    }


    /**
     * 根据角色ID获取角色信息
     * @param  [type] $id [description]
     * @return [type]     [description]
     */
    public function getRoleById($id) {

        $query = $this->db->query('select ' . $this->fields . ' from ' . $this->table . ' where `id`=' . $id);
        $result = $query->result_array();
        return array(
            'status'    => 0,
            'msg'       => '操作成功！',
            'data'      => $result[0]
        );
    }


    /**
     * 分页获取角色列表
     * @param  integer $page    [description]
     * @param  integer $size    [description]
     * @param  string  $keyword [description]
     * @return [type]           [description]
     */
    public function getRoleByPage($page=1, $size=20) {

        $result = array();
        $limitStart = ($page - 1) * $size;
        $query = $this->db->query('select ' . $this->fields . ' from ' . $this->table . ' order by create_time desc limit ' . $limitStart . ', ' . $size);
        $result = $query->result_array();
        $this->load->model('admin_model');
        $this->load->model('menu_model');
        $CI = &get_instance();
        foreach($result as &$item) {
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
            if($item['pms']) {
                $pmsArr = explode(',', $item['pms']);
                $pmsNameArr = array();
                foreach($pmsArr as $v) {
                    $menuInfo = $CI->menu_model->getMenuById($v);
                    $pmsNameArr[] = $menuInfo['data']['name'];
                }
                $item['pms_name'] = implode('，<br/>', $pmsNameArr);
            } else {
                $item['pms_name'] = '';
            }
        }
        $pageQuery = $this->db->query('select count(1) as num from ' . $this->table);
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
     * 获取角色列表
     * @return [type] [description]
     */
    public function getRoleList() {

        $result = array();
        $query = $this->db->query('select ' . $this->fields . ' from ' . $this->table . ' order by id desc');
        $result = $query->result_array();
        return array(
            'status'    => 0,
            'msg'       => '操作成功！',
            'data'      => $result
        );
    }
}
