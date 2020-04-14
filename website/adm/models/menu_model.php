<?php
/**
 * 系统菜单模型
 *
 * @author linzequan <lowkey361@gmail.com>
 *
 */
class Menu_model extends MY_Model {

    public function __construct() {
        parent::__construct();
        $this->table = 'sys_menu';
        $this->fields = 'id, pid, name, ctrl_name, `sort`, mark, create_time, update_time, create_userid, update_userid';
        // $this->loginInfo = $this->session->userdata('loginInfo');
		$this->loginInfo = isset($_SESSION['loginInfo']) ? $_SESSION['loginInfo'] : '';
    }


    /**
     * 查询菜单数据
     * @return [type] [description]
     */
    public function search() {
        $query = $this->db->select($this->fields)->order_by('pid asc, `sort` desc')->get($this->table);
        $list = $query->result_array();
        $tree = array();
        create_tree_list($list, $tree, 0, 0, array('id_key'=>'id', 'pid_key'=> 'pid'));
        $this->load->model('admin_model');
        $CI = &get_instance();
        foreach($tree as &$item) {
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
        return array(
            'status'    => 0,
            'msg'       => '操作成功！',
            'data'      => array_values($tree)
        );
    }


    /**
     * 添加菜单
     * @param [type] $params [description]
     */
    public function add($params) {

        $msg = '';
        if($params['pid']=='') $msg = 'The superial menu cannot be empty!';
        if($params['name']=='') $msg = 'The name cannot be empty!';
        if($msg != '') {
            return array(
                'status'    => -1,
                'msg'       => $msg
            );
        }
        $data = array(
            'name'          => $params['name'],
            'pid'           => $params['pid'],
            'ctrl_name'     => $params['ctrl_name'],
            'sort'          => $params['sort'],
            'mark'          => $params['mark'],
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
     * 更新菜单信息
     * @param  [type] $params [description]
     * @param  [type] $where  [description]
     * @return [type]         [description]
     */
    public function update($params, $where) {
        $data = array(
            'name'          => $params['name'],
            'pid'           => $params['pid'],
            'ctrl_name'     => $params['ctrl_name'],
            'sort'          => $params['sort'],
            'mark'          => $params['mark'],
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
     * 删除菜单
     * @param  [type] $id [description]
     * @return [type]     [description]
     */
    public function delete($id) {

        // 查询当前菜单下是否有子菜单，有的话则不允许删除
        $query = $this->db->query('select count(1) as num from ' . $this->table . ' where `pid`=' . $id);
        $result = $query->result_array();
        if($result[0]['num'] > 0) {
            return array(
                'status'    => -1,
                'msg'       => '存在子菜单，请先删除子菜单！'
            );
        }

        $this->db->delete($this->table, array('id'=> $id));
        return array(
            'status'    => 0,
            'msg'       => '操作成功！'
        );
    }


    /**
     * 根据菜单ID查询菜单信息
     * @param  [type] $id [description]
     * @return [type]     [description]
     */
    public function getMenuById($id) {

        $query = $this->db->query('select ' . $this->fields . ' from ' . $this->table . ' where `id`=' . $id);
        $result = $query->result_array();
        return array(
            'status'    => 0,
            'msg'       => '操作成功！',
            'data'      => $result[0]
        );

    }


    /**
     * 获取菜单树
     * @return [type] [description]
     */
    public function getMenuTree() {

        $query = $this->db->query('select ' . $this->fields . ' from ' . $this->table);
        $result = $query->result_array();
        $tree = array();
        // 将分类id作为数组key，并创建children单元
        foreach($result as $v) {
            $tree[$v['id']] = $v;
            $tree[$v['id']]['children'] = array();
        }
        // 利用引用，将每个分类添加到父类children数组中
        foreach($tree as $k=>$v) {
            if($v['pid'] != 0) {
                $tree[$v['pid']]['children'][] = &$tree[$k];
                if($tree[$k]['children'] == null) {
                    unset($tree[$k]['children']);
                }
            }
        }
        // 删除无用的非根节点数据
        foreach($tree as $k=>$v) {
            if($v['pid'] != 0) {
                unset($tree[$k]);
            }
        }

        return array(
            'status'    => 0,
            'msg'       => '操作成功！',
            'data'      => $tree
        );

    }
}
