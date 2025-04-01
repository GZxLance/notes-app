import {
  Layout,
  Typography,
  Button,
  Modal,
  Input,
  Space,
  message,
  Row,
  Col,
} from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { Pie } from '@ant-design/plots';
import Navbar from '@/components/Navbar';
import NoteList from '@/components/NoteList';
import { useStore } from '@/store/userStore';
import { createCategory, getCategories } from '@/api/categoryApi';
import { getNotes } from '@/api/noteApi';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const { Content } = Layout;
const { Title } = Typography;
const { confirm } = Modal;

const Home = () => {
  const { user } = useStore();
  const navigate = useNavigate();
  const [recentNotes, setRecentNotes] = useState([]);
  const [categoryStats, setCategoryStats] = useState([]);

  useEffect(() => {
    if (user) {
      loadRecentNotes();
      loadCategoryStats();
    }
  }, [user]);

  const loadCategoryStats = async () => {
    try {
      const [categoriesResponse, notesResponse] = await Promise.all([
        getCategories(),
        getNotes(user.id),
      ]);

      const categories = categoriesResponse.data;
      const notes = notesResponse.data;

      const stats = categories.map((category) => {
        const count = notes.filter(
          (note) => note.category_id === category.id,
        ).length;
        return {
          type: category.name,
          value: count,
        };
      });

      setCategoryStats(stats);
    } catch (error) {
      console.error('Failed to fetch category statistics:', error);
      message.error('获取分类统计失败');
    }
  };

  const loadRecentNotes = async () => {
    try {
      const response = await getNotes(user.id);
      const sortedNotes = response.data
        .sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at))
        .slice(0, 8);
      setRecentNotes(sortedNotes);
    } catch (error) {
      console.error('Failed to fetch recent notes:', error);
      message.error('获取最近笔记失败');
    }
  };

  const handleCreateCategory = () => {
    Modal.confirm({
      title: '新建分类',
      content: <Input placeholder="请输入分类名称" id="categoryName" />,
      onOk: async () => {
        const categoryName = document.getElementById('categoryName').value;
        if (!categoryName.trim()) {
          message.error('分类名称不能为空');
          return;
        }
        try {
          await createCategory({ name: categoryName, userId: user.id });
          message.success('创建分类成功');
          navigate('/categories');
        } catch (error) {
          console.error('Failed to create category:', error);
          message.error('创建分类失败');
        }
      },
    });
  };

  return (
    <Layout>
      <Navbar />
      <Content className="p-6">
        {user ? (
          <>
            <Title level={2}>欢迎,{user.nickname || user.username}</Title>
            <div className="mb-8">
              <Title level={4}>开始</Title>
              <Space size="middle">
                <Button
                  type="primary"
                  icon={<PlusOutlined />}
                  onClick={() => navigate('/create-note')}
                >
                  新建笔记
                </Button>
                <Button icon={<PlusOutlined />} onClick={handleCreateCategory}>
                  新建分类
                </Button>
              </Space>
            </div>
            <Row gutter={24}>
              <Col span={12}>
                <div className="mb-8">
                  <Title level={4}>最近使用</Title>
                  <NoteList notes={recentNotes} />
                </div>
              </Col>
              <Col span={12}>
                <div className="mb-8">
                  <Title level={4}>分类统计</Title>
                  {categoryStats.length > 0 && (
                    <div style={{ height: 300 }}>
                      <Pie
                        data={categoryStats}
                        angleField="value"
                        colorField="type"
                        radius={0.8}
                        label={{
                          type: 'outer',
                          content: '{name} {percentage}',
                        }}
                        interactions={[{ type: 'element-active' }]}
                      />
                    </div>
                  )}
                </div>
              </Col>
            </Row>
          </>
        ) : (
          <Title level={2}>欢迎来到笔记应用</Title>
        )}
      </Content>
    </Layout>
  );
};

export default Home;
