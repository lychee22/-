import React, { createContext, useContext, useState, useMemo } from 'react';

// 创建文章上下文
const ArticleContext = createContext<Record<any, any>>({
    articles: [],
    addArticle: () => { },
    selectedArticle: null,
    setSelectedArticle: () => { },
});

// 文章上下文提供者组件
const ArticleProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    // 使用 useState 管理文章列表状态
    const [articles, setArticles] = useState<Record<any, any>[]>([]);
    // 使用 useState 管理选中的文章状态
    const [selectedArticle, setSelectedArticle] = useState<Record<any, any> | null>(null);

    // 添加文章的函数
    const addArticle = (newArticle: Record<any, any>) => {
        setArticles((prevArticles) => [...prevArticles, newArticle]);
    };

    // 使用 useMemo 缓存上下文值，避免不必要的重新渲染
    const contextValue = useMemo(() => ({
        articles,
        addArticle,
        selectedArticle,
        setSelectedArticle,
    }), [articles, selectedArticle]);

    return (
        <ArticleContext.Provider value={contextValue}>
            {children}
        </ArticleContext.Provider>
    );
};

// 自定义钩子，用于在组件中获取文章上下文
const useArticleContext = () => {
    return useContext(ArticleContext);
};

export { ArticleProvider, useArticleContext };