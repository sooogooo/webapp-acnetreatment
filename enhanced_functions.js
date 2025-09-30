        // ========== 增强搜索功能 ==========
        const categoryData = {
            understanding: {
                title: '认识痘痘',
                chapters: ['01_true_face.md', '02_hidden_culprits.md'],
                keywords: ['成因', '类型', '分级', '发病机制', '轻度', '中度', '重度']
            },
            treatment: {
                title: '治疗方案',
                chapters: ['04_professional_treatment.md', 'medical_beauty_guide.md'],
                keywords: ['治疗', '药物', '激光', '点阵', '微针', '水杨酸', '刷酸']
            },
            daily_care: {
                title: '日常护理',
                chapters: ['05_skincare_methods.md', '06_makeup_guide.md', '08_diet_nutrition.md', '09_lifestyle_stress.md'],
                keywords: ['护肤', '化妆', '饮食', '作息', '压力管理']
            },
            psychology: {
                title: '心理支持',
                chapters: ['03_psychological_impact.md', '11_rebuild_confidence.md', '12_family_social_support.md'],
                keywords: ['心理', '自信', '焦虑', '社交', '家庭支持']
            },
            scar_repair: {
                title: '痘坑修复',
                chapters: ['07_scar_treatment.md', 'medical_beauty_guide.md'],
                keywords: ['痘坑', '痘印', '瘢痕', '修复', '小针刀']
            },
            special_groups: {
                title: '特殊人群',
                chapters: ['13_teenage_management.md', '14_adult_women_management.md'],
                keywords: ['青少年', '成年女性', '职场', '女性']
            }
        };

        function performEnhancedSearch() {
            const query = document.getElementById('enhancedSearchInput').value.trim();
            if (!query) {
                alert('请输入搜索关键词');
                return;
            }
            quickSearch(query);
        }

        function quickSearch(keyword) {
            document.getElementById('enhancedSearchInput').value = keyword;

            const resultsDiv = document.getElementById('searchResults');
            resultsDiv.style.display = 'block';
            resultsDiv.innerHTML = '<div style="text-align: center; color: #667eea;"><p>🔍 搜索中...</p></div>';

            setTimeout(() => {
                const matches = chapters.filter(chapter =>
                    chapter.title.includes(keyword) ||
                    chapter.desc.includes(keyword) ||
                    (chapter.file && chapter.file.includes(keyword.toLowerCase()))
                );

                const categoryMatches = Object.entries(categoryData).filter(([key, data]) =>
                    data.keywords.some(k => k.includes(keyword) || keyword.includes(k))
                );

                if (matches.length === 0 && categoryMatches.length === 0) {
                    resultsDiv.innerHTML = '<div style="text-align: center; color: #95a5a6;"><p>😔 未找到相关内容</p><p style="font-size: 0.9em;">试试其他关键词，如：激光、水杨酸、心理</p></div>';
                    return;
                }

                const totalResults = matches.length + categoryMatches.length;
                let html = '<h4 style="color: #2c3e50; margin-bottom: 15px;">找到 ' + totalResults + ' 个相关结果：</h4>';

                matches.forEach(chapter => {
                    html += '<div onclick="loadChapter(\'' + chapter.file + '\', \'' + chapter.title + '\')" style="background: white; padding: 15px; border-radius: 10px; margin-bottom: 10px; cursor: pointer; transition: all 0.3s; border-left: 4px solid #667eea;">';
                    html += '<h5 style="color: #667eea; margin-bottom: 5px;">' + chapter.title + '</h5>';
                    html += '<p style="font-size: 0.9em; color: #7f8c8d; margin: 0;">' + chapter.desc + '</p>';
                    html += '</div>';
                });

                categoryMatches.forEach(([key, data]) => {
                    html += '<div onclick="showCategoryContent(\'' + key + '\')" style="background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%); padding: 15px; border-radius: 10px; margin-bottom: 10px; cursor: pointer;">';
                    html += '<h5 style="color: #667eea; margin-bottom: 5px;">📁 ' + data.title + ' 专题</h5>';
                    html += '<p style="font-size: 0.9em; color: #555; margin: 0;">包含 ' + data.chapters.length + ' 个相关章节</p>';
                    html += '</div>';
                });

                resultsDiv.innerHTML = html;
            }, 300);
        }

        function showCategoryContent(categoryKey) {
            const category = categoryData[categoryKey];
            if (!category) return;

            const resultsDiv = document.getElementById('searchResults');
            resultsDiv.style.display = 'block';
            resultsDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

            let html = '<div style="margin-bottom: 20px;">';
            html += '<h3 style="color: #2c3e50; margin-bottom: 10px;">📚 ' + category.title + '</h3>';
            html += '<p style="color: #7f8c8d; margin-bottom: 20px;">该专题包含以下章节：</p>';
            html += '</div>';

            category.chapters.forEach(chapterFile => {
                const chapter = chapters.find(c => c.file === chapterFile);
                if (chapter) {
                    html += '<div onclick="loadChapter(\'' + chapter.file + '\', \'' + chapter.title + '\')" style="background: white; padding: 18px; border-radius: 12px; margin-bottom: 12px; cursor: pointer; box-shadow: 0 2px 10px rgba(0,0,0,0.05); border-left: 4px solid #667eea;">';
                    html += '<h4 style="color: #667eea; margin-bottom: 8px; font-size: 1.1em;">' + chapter.title + '</h4>';
                    html += '<p style="font-size: 0.9em; color: #7f8c8d; margin: 0;">' + chapter.desc + '</p>';
                    html += '</div>';
                }
            });

            html += '<button onclick="document.getElementById(\'searchResults\').style.display=\'none\'" style="width: 100%; padding: 12px; background: #f0f0f0; border: none; border-radius: 10px; cursor: pointer; margin-top: 15px;">关闭</button>';

            resultsDiv.innerHTML = html;
        }

        document.addEventListener('DOMContentLoaded', function() {
            const searchInput = document.getElementById('enhancedSearchInput');
            if (searchInput) {
                searchInput.addEventListener('keypress', function(e) {
                    if (e.key === 'Enter') {
                        performEnhancedSearch();
                    }
                });
            }
        });