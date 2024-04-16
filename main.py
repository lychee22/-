import openpyxl
import requests
import pymysql
from lxml import etree
from tqdm import tqdm

headers = {
    'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36 Edg/123.0.0.0'
}


# 组合日期链接
def cnew_url():
    f = open(r'D:/code/code/NewsRecommend/NewsRecommend/spider/cnew_url.txt', 'w', encoding='utf8')
    for i in range(12, 13):
        if i < 10:
            url = 'https://www.chinanews.com.cn/scroll-news/2024/040' + str(i) + '/news.shtml'
        else:
            url = 'https://www.chinanews.com.cn/scroll-news/2024/04' + str(i) + '/news.shtml'
        f.write(url + '\n')
    f.close()


# step 1.2 写入数据库
def saveToDB(new_cid, new_category, new_title, new_cnt, new_url, new_date):
    # mysql连接配置
    cur = pymysql.connect(user='root',
                          password="root",
                          host='localhost',
                          database='news')
    cursor = cur.cursor()  # 游标
    # print(new_cid+new_category+new_title+new_cnt+new_url+new_date)
    sql = f"insert into new (new_cid,new_category,new_title,new_cnt,new_url,new_date) values ('{new_cid}','{new_category}','{new_title}','{new_cnt}','{new_url}','{new_date}')"
    # sql插入语句
    # 操作捕捉异常，如果没有异常则继续执行，如若有则抛出异常
    try:
        cursor.execute(sql)  # 执行sql语句
        cur.commit()  # 提交至数据库
    except Exception as e:
        print(e)
        print(sql)


def cnew_data():
    f = open(r'D:/code/code/NewsRecommend/NewsRecommend/spider/cnew_url.txt', encoding='utf8')  # 读取上面已经组合好的链接
    l = openpyxl.load_workbook(r'D:/code/code/NewsRecommend/NewsRecommend/spider/cnew_data.xlsx')
    sheet = l.active
    m = open(r'D:/code/code/NewsRecommend/NewsRecommend/spider/cnew_url1.txt', 'a', encoding='utf8')  # 保存报错的链接
    x = 1  # 从Excel的第几行开始写入
    for i in f:
        lj1 = []
        # 发起请求,获取页面里面的新闻链接
        req = requests.get(i.replace('\n', ''), headers=headers)
        # 设置网页编码，不设置会乱码
        req.encoding = 'utf8'
        ht = etree.HTML(req.text)
        # 获取分类的数据还有正文链接
        fl = ht.xpath("//div[@class='dd_lm']/a/text()")
        print(fl)
        lj = ht.xpath("//div[@class='dd_bt']/a/@href")
        # 链接有两种格式，分别组合成可以用的
        for j in lj:
            if j[:5] == '//www':
                lj1.append('https:' + j)
            else:
                lj1.append('https://www.chinanews.com.cn/' + j)
        n = 0
        for k in tqdm(lj1):
            try:
                data = []
                reqs = requests.get(k, headers=headers, timeout=10)
                reqs.encoding = 'utf8'
                ht1 = etree.HTML(reqs.text)
                bt = ht1.xpath("//h1[@class='content_left_title']/text()")  # 标题

                if bt:
                    data.append([fl[n]])
                    data.append(ht1.xpath("//h1[@class='content_left_title']/text()"))  # 标题
                    # data.append(ht1.xpath("//div[@class='left_zw']/p/text()"))  # 简介
                    # 获取正文内容
                    # 获取左侧正文区域的 div
                    left_zw_div = ht1.xpath("//div[@class='left_zw']")[0]
                    # 获取所有 p 标签的文本内容
                    p_texts = left_zw_div.xpath(".//p")
                    # 获取所有 img 标签的图片链接
                    content = ''  # 文章内容
                    img_urls = left_zw_div.xpath(".//img/@src")
                    # 按照 p 标签和 img 标签在 HTML 结构中的顺序，将文本内容和图片链接存储到 content 中
                    for c in range(len(p_texts)):
                        # 存储 p 标签的文本内容
                        p_text = p_texts[c].xpath("string()")
                        content += "&emsp;&emsp;" + p_text.strip() + '\n\n'
                        # 存储对应的 img 标签的图片链接
                        if c < len(img_urls):
                            content += "&emsp;&emsp;" + '![Description](http:' + img_urls[c] + '#pic_center)\n\n'
                    data.append(content)  # 按顺序存储图片和文字
                    data.append([lj1[n]])
                else:
                    data.append([fl[n]])
                    data.append(ht1.xpath("//div[@class='content_title']/div[@class='title']/text()"))
                    # data.append(ht1.xpath("//div[@class='content_desc']/p/text()"))  # 简介
                    # 获取正文内容
                    # 获取左侧正文区域的 div
                    left = ht1.xpath("//div[@class='left_zw']")[0]
                    # 获取所有 p 标签的文本内容
                    p = left.xpath(".//p")
                    # 获取所有 img 标签的图片链接
                    content = ''  # 文章内容
                    urls = left.xpath(".//img/@src")
                    # 按照 p 标签和 img 标签在 HTML 结构中的顺序，将文本内容和图片链接存储到 content 中
                    for c in range(len(p)):
                        # 存储 p 标签的文本内容
                        p = p[c].xpath("string()")
                        content += "&emsp;&emsp;" + p.strip() + '\n\n'
                        # 存储对应的 img 标签的图片链接
                        if c < len(urls):
                            content += '![Description](http:' + urls[c] + '#pic_center)\n\n'
                    data.append(content)  # 按顺序存储图片和文字
                    data.append([lj1[n]])

                catorgy = {'国际': 1, '财经': 2, '体育': 3, '文化': 4, '国内': 5, '视频': 6, '图片': 7, '社会': 8,
                           '生活': 9, '华人': 10}
                list = data[3][0].split('/')
                if data[2][0] != "":
                    if 10 >= catorgy[data[0][0]] >= 1:
                        print(data[2])
                        saveToDB(catorgy[data[0][0]], data[0][0], data[1][0], data[2], data[3][0],
                                 "2024-" + list[-2])
                    else:
                        saveToDB(0, data[0][0], data[1][0], data[2], data[3][0], "2024-" + list[-2])
                for y in range(len(data)):
                    sheet.cell(x, y + 1).value = '\n'.join(data[y])
                x += 1
                n += 1
            except Exception as arr:
                m.write(lj1[n])
                continue
        l.save(r'D:/code/code/NewsRecommend/NewsRecommend/spider/cnew_data.xlsx')
    f.close()
    m.close()


if __name__ == '__main__':
    cnew_url()
    cnew_data()
