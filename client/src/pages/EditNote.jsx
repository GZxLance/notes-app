import React, { useState, useEffect } from 'react';
import { Form, message } from 'antd'; // 引入 Ant Design 的 Form 和全局提示组件
import { updateNote, getNote } from '@/api/noteApi'; // 引入更新笔记和获取笔记详情的 API 方法
import { getCategories } from '@/api/categoryApi'; // 引入获取分类列表的 API 方法
import { useStore } from '@/store/userStore'; // 引入用户状态管理（如用户信息）
import { useNavigate, useParams } from 'react-router-dom'; // 引入路由导航钩子和参数获取钩子
import Navbar from '@/components/Navbar'; // 引入导航栏组件
import NoteForm from '@/components/NoteForm'; // 引入笔记表单组件

// 编辑笔记页面组件
const EditNote = () => {
  const navigate = useNavigate(); // 获取路由导航函数，用于页面跳转
  const { noteId } = useParams(); // 获取 URL 参数中的笔记 ID
  const { user } = useStore(); // 从用户状态管理中获取当前用户信息
  const [categories, setCategories] = useState([]); // 定义分类列表的状态，默认为空数组
  const [noteData, setNoteData] = useState(null); // 定义笔记数据的状态，默认为 null
  const [form] = Form.useForm(); // 使用 Ant Design 的 Form 表单实例，用于表单操作

  // 在组件挂载时获取笔记详情和分类列表数据
  useEffect(() => {
    const fetchData = async () => {
      try {
        // 并行调用两个 API：获取笔记详情和分类列表
        const [noteResponse, categoriesResponse] = await Promise.all([
          getNote(noteId), // 根据笔记 ID 获取笔记详情
          getCategories(), // 获取分类列表
        ]);

        const fetchedNoteData = noteResponse.data; // 提取笔记详情数据
        setNoteData(fetchedNoteData); // 将笔记数据存储到状态中
        setCategories(categoriesResponse.data); // 将分类数据存储到状态中
      } catch (error) {
        console.error('Failed to fetch data:', error); // 捕获并打印错误日志
        message.error('获取数据失败！'); // 显示错误提示
      }
    };
    fetchData(); // 调用获取数据的函数
  }, [noteId]); // 当笔记 ID 变化时重新执行

  // 提交表单时的处理函数
  const handleSubmit = async (values) => {
    try {
      const noteData = {
        ...values, // 表单提交的所有字段值
        userId: user.id, // 添加当前用户的 ID
      };
      await updateNote(noteId, noteData); // 调用 API 更新笔记
      message.success('笔记更新成功'); // 显示成功提示
      navigate('/notes'); // 跳转到笔记列表页面
    } catch (error) {
      console.error('Failed to update note:', error); // 捕获并打印错误日志
      message.error('更新笔记失败'); // 显示错误提示
    }
  };

  return (
    <>
      <Navbar />
      <div className="p-4">
        <h1>编辑笔记</h1>
        {/* 笔记表单组件 */}
        <NoteForm
          form={form} // 传递表单实例
          initialValues={noteData} // 设置表单的初始值为笔记数据
          onSubmit={handleSubmit} // 传递表单提交处理函数
          categories={categories} // 传递分类列表数据
          submitButtonText="更新笔记" // 设置提交按钮的文本
        />
      </div>
    </>
  );
};

export default EditNote; // 导出组件
