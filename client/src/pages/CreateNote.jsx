import React, { useState, useEffect } from 'react';
import { Form, message } from 'antd'; // 引入 Ant Design 的 Form 和全局提示组件
import { createNote } from '@/api/noteApi'; // 引入创建笔记的 API 方法
import { getCategories } from '@/api/categoryApi'; // 引入获取分类列表的 API 方法
import { useStore } from '@/store/userStore'; // 引入用户状态管理（如用户信息）
import { useNavigate } from 'react-router-dom'; // 引入路由导航钩子
import Navbar from '@/components/Navbar'; // 引入导航栏组件
import NoteForm from '@/components/NoteForm'; // 引入笔记表单组件

// 创建笔记页面组件
const CreateNote = () => {
  const navigate = useNavigate(); // 获取路由导航函数，用于页面跳转
  const { user } = useStore(); // 从用户状态管理中获取当前用户信息
  const [categories, setCategories] = useState([]); // 定义分类列表的状态，默认为空数组
  const [form] = Form.useForm(); // 使用 Ant Design 的 Form 表单实例，用于表单操作

  // 在组件挂载时获取分类列表数据
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await getCategories(); // 调用 API 获取分类列表
        setCategories(response.data); // 将分类数据存储到状态中
      } catch (error) {
        console.error('Failed to fetch categories:', error); // 捕获并打印错误日志
        message.error('获取分类失败'); // 显示错误提示
      }
    };
    fetchCategories(); // 调用获取分类列表的函数
  }, []); // 空依赖数组确保只在组件挂载时执行一次

  // 提交表单时的处理函数
  const handleSubmit = async (values) => {
    try {
      const editorInstance = tinymce.get('content');
      const plainText = await editorInstance.getContent({ format: 'text' });
      const noteData = {
        ...values, // 表单提交的所有字段值
        userId: user.id, // 添加当前用户的 ID
        content: plainText, // 提取编辑器中的纯文本内容
      };
      await createNote(noteData); // 调用 API 创建笔记
      message.success('笔记创建成功'); // 显示成功提示
      navigate('/notes'); // 跳转到笔记列表页面
    } catch (error) {
      console.error('Failed to create note:', error); // 捕获并打印错误日志
      message.error('创建笔记失败'); // 显示错误提示
    }
  };

  return (
    <>
      <Navbar />
      <div className="p-4">
        <h1>创建笔记</h1>
        {/* 笔记表单组件 */}
        <NoteForm
          form={form} // 传递表单实例
          onSubmit={handleSubmit} // 传递表单提交处理函数
          categories={categories} // 传递分类列表数据
          submitButtonText="创建笔记" // 设置提交按钮的文本
        />
      </div>
    </>
  );
};

export default CreateNote; // 导出组件
