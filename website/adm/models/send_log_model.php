<?php
/**
 * 推送消息记录模板模型
 *
 * @author linzequan <lowkey361@gmail.com>
 *
 */
class Send_log_model extends MY_Model {

    public function __construct() {
        parent::__construct();
        $this->table = 'sbj_send_log';
        $this->fields = 'id, wx_openid, telephone, wxinfo, wx_nickname, wx_headimgurl, business_type_id, business_type_name, content, create_user_id, create_user_name, create_time, status, status_ex, msgid';
        // $this->loginInfo = $this->session->userdata('loginInfo');
		$this->loginInfo = isset($_SESSION['loginInfo']) ? $_SESSION['loginInfo'] : '';
    }


    /**
     * 保存发送日志
     * @param  [type] $params [description]
     * @return [type]         [description]
     */
    public function save($params) {
        $data = array(
            'wx_openid'     => $params['openid'],
            'telephone'     => $params['telephone'],
            'wxinfo'        => $params['wxinfo'],
            'wx_nickname'   => $params['wx_nickname'],
            'wx_headimgurl' => $params['wx_headimgurl'],
            'business_type_id'  => $params['business_type_id'],
            'business_type_name'=> $params['business_type_name'],
            'content'       => $params['content'],
            'create_user_id'=> $this->loginInfo['id'],
            'create_user_name'  => $this->loginInfo['username'],
            'create_time'   => time(),
            'status'        => $params['status'],
            'status_ex'     => $params['status_ex'],
            'msgid'         => $params['msgid']
        );
        $this->db->insert($this->table, $data);
        return true;
    }


    /**
     * 分页获取列表
     * @param  integer $page    [description]
     * @param  integer $size    [description]
     * @param  string  $keyword [description]
     * @return [type]           [description]
     */
    public function getListByPage($page=1, $size=20, $keywords) {

        $result = array();
        $keywordArr = array();
        if($keywords['telephone'] != '') {
            $keywordArr[] = ' `telephone` like "%' . $keywords['telephone'] . '%" ';
        }
        if($keywords['status'] == 0) {
            $keywordArr[] = ' `status` = 0 ';
        } else if($keywords['status'] == 1) {
            $keywordArr[] = ' `status` != 0 ';
        }
        if(count($keywordArr) > 0) {
            $keyword = implode(' and ', $keywordArr);
            $where = ' where (' . $keyword . ') ';
        } else {
            $where = ' where 1=1 ';
        }
        $limitStart = ($page - 1) * $size;
        $query = $this->db->query('select ' . $this->fields . ' from ' . $this->table . $where . ' order by id desc limit ' . $limitStart . ', ' . $size);
        $result = $query->result_array();
        foreach($result as &$item) {
            if($item['create_time']) {
                $item['create_time'] = date('Y-m-d H:i:s', $item['create_time']);
            } else {
                $item['create_time'] = '';
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

}
