import { BookPage, EvaluationSkill } from '../curriculum/types';
import { SchoolBranding } from '../institutional_branding/schoolBranding';
import { generateQRCodeSvgSync } from '../speech_and_multimedia/qrHelper';
import { UNIT_MASTERY_QUIZZES, MasteryQuiz } from '../reading_fluency_and_diagnostics/unitMasteryQuizzes';

/**
 * Renders an authentic 4-Line Handwriting grid or standard handwriting line based on user configuration.
 */
function renderHandwritingSlot(branding: SchoolBranding, customClass = ''): string {
  if (branding.showHandwritingLinesInPrint === false) return '';
  if (branding.show4LineGrid !== false) {
    return `
      <div class="arabic-4line-container ${customClass}">
        <div class="grid-line line-ascender" title="خط الحروف الصاعدة (أ، ل، ك، ط)"></div>
        <div class="grid-line line-waist" title="خط الوسط (رؤوس الحروف)"></div>
        <div class="grid-line line-base" title="خط الأساس (سطر الكتابة الرئيسي)"></div>
        <div class="grid-line line-descender" title="خط الحروف الهابطة (ر، ز، و، ي، ج، ق)"></div>
        <span class="grid-guide-indicator">ـ✍️ـ</span>
      </div>
    `;
  }
  return `<div class="handwriting-dotted-line ${customClass}"></div>`;
}

/**
 * Renders QR Code badge for instant mobile audio practice
 */
function renderQRCodeBadge(page: BookPage, branding: SchoolBranding): string {
  if (branding.showQRCode === false) return '';
  const targetUrl = branding.qrCodeCustomUrl || `https://ibn-sina-reading.edu/page/${page.pageNumber}?unit=${page.unitId}&skill=${encodeURIComponent(page.title)}`;
  const qrSvg = generateQRCodeSvgSync(targetUrl, 42);
  return `
    <div class="qr-code-header-badge" title="امسح الرمز للاستماع للنطق الصوتي لتمارين الصفحة بالهاتف">
      <div class="qr-svg-wrap">${qrSvg}</div>
      <span class="qr-sub-text">📱 استمع للنطق</span>
    </div>
  `;
}

/**
 * Renders a full A4 Unit Mastery Quiz page
 */
function renderMasteryQuizHtml(
  quiz: MasteryQuiz, 
  branding: SchoolBranding, 
  sName: string, 
  sGrade: string, 
  sClass: string,
  pageIndex: number
): string {
  const countryName = branding.countryName || 'الجمهورية اليمنية';
  const ministryName = branding.ministryName || 'وزارة التربية والتعليم';
  const schoolName = branding.schoolName || 'مدارس ابن سيناء الأهلية';
  const departmentName = branding.departmentName || 'قسم إدارة الجودة والتطوير';
  const isBooklet = branding.bookletMode;
  const pageClass = isBooklet ? (pageIndex % 2 === 0 ? 'page-even' : 'page-odd') : '';

  const qrSvg = branding.showQRCode !== false 
    ? generateQRCodeSvgSync(branding.qrCodeCustomUrl || `https://ibn-sina-reading.edu/quiz/${quiz.unitId}`, 42)
    : '';

  return `
    <div class="print-page quiz-mastery-page ${branding.inkSaverMode ? 'ink-saver' : ''} ${pageClass}">
      
      <!-- Quiz Header -->
      <header class="page-header quiz-header-border">
        <div class="header-top-row">
          <div class="school-branding-group">
            ${branding.showLogoInPrint && branding.logoUrl ? `<img src="${branding.logoUrl}" class="school-logo-img" alt="شعار المدرسة" />` : ''}
            <div class="school-titles">
              <div class="country-line">${countryName} — ${ministryName}</div>
              <h1>${schoolName}</h1>
              <p>${departmentName}</p>
            </div>
          </div>

          <div class="header-center-title">
            <span class="unit-badge">ملحق قياس الأثر — الوحدة ${quiz.unitNumber} (${quiz.unitTitle})</span>
            <div class="page-main-title">${quiz.quizTitle}</div>
          </div>

          <div style="text-align: left; display: flex; align-items: center; gap: 8px;">
            ${qrSvg ? `
              <div class="qr-code-header-badge">
                <div class="qr-svg-wrap">${qrSvg}</div>
                <span class="qr-sub-text">اختبار صوتي</span>
              </div>
            ` : ''}
            <div>
              <div class="page-num-badge">Q${quiz.quizNumber}</div>
              <div class="page-num-sub">اختبار تقويم</div>
            </div>
          </div>
        </div>

        <div class="student-info-bar">
          <div class="info-item"><strong>اسم التلميذ/ة: </strong><span>${sName}</span></div>
          <div class="info-item"><strong>الصف والشعبة: </strong><span>${sGrade} (${sClass})</span></div>
          <div class="info-item"><strong>المعلم/ة: </strong><span>${branding.teacherName || '................'}</span></div>
          <div class="info-item"><strong>تاريخ الاختبار: </strong><span>.... / .... / ١٤٤هـ</span></div>
        </div>
      </header>

      <main class="page-content space-y-4">
        <!-- Target skill notice -->
        <div class="goal-procedure-bar">
          <div class="goal-item"><strong>🎯 المهارة المقاسة:</strong> <span>${quiz.targetSkill}</span></div>
        </div>

        <!-- Section 1: Reading Speed & Fluency Meter -->
        <div class="quiz-section-block">
          <div class="quiz-section-header">
            <span class="q-sec-badge">١</span>
            <span class="q-sec-title">مقياس زمن القراءة والطلاقة السريعة (قراءة الكلمات وضبط الوقت):</span>
            <span class="q-sec-timer-box">⏱️ زمن الإنجاز: [ &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; ] ثانية</span>
          </div>

          <div class="words-reading-grid grid-words my-2">
            ${quiz.readingSpeedWords.map(w => `
              <div class="word-card">
                <span class="word-text font-amiri">${w}</span>
              </div>
            `).join('')}
          </div>

          <div class="fluency-benchmark-bar">
            <strong>معيار الطلاقة والسرعة:</strong>
            <span class="bench-tag tag-exc">⭐ ممتاز: ${quiz.readingSpeedBenchmark.excellentThreshold}</span>
            <span class="bench-tag tag-good">👍 جيد: ${quiz.readingSpeedBenchmark.goodThreshold}</span>
            <span class="bench-tag tag-train">🔄 تدريب: ${quiz.readingSpeedBenchmark.needsTrainingThreshold}</span>
          </div>
        </div>

        <!-- Section 2: Dictation Challenge Board -->
        <div class="quiz-section-block">
          <div class="quiz-section-header">
            <span class="q-sec-badge">٢</span>
            <span class="q-sec-title">لوحة الإملاء الاختباري الغيبي (يملي المعلم الكلمات ويكتبها التلميذ على خط النسخ):</span>
          </div>

          <div class="quiz-dictation-grid">
            ${quiz.dictationChallengeWords.map((_, dIdx) => `
              <div class="quiz-dict-slot">
                <div class="dict-slot-num">${dIdx + 1}</div>
                <div class="dict-slot-write">
                  ${renderHandwritingSlot(branding, 'compact')}
                </div>
                <div class="dict-slot-check">[ ] صح</div>
              </div>
            `).join('')}
          </div>
        </div>

        <!-- Section 3: Phonetic Analysis & Rule Check -->
        <div class="quiz-section-block">
          <div class="quiz-section-header">
            <span class="q-sec-badge">٣</span>
            <span class="q-sec-title">التحليل الصوتي وقواعد المهارة:</span>
          </div>

          <div class="grid grid-cols-2 gap-3">
            <div class="bg-slate-50 p-2.5 rounded-xl border border-slate-200">
              <strong class="text-xs text-slate-800 block mb-1.5">حلل الكلمات إلى مقاطعها الصوتية:</strong>
              ${quiz.phoneticAnalysisItems.map(item => `
                <div class="flex items-center justify-between py-1 border-b border-slate-200 text-xs">
                  <span class="font-bold font-amiri text-sm">${item.word}</span>
                  <div class="flex gap-1">
                    ${item.expectedSyllables.map(() => `<span class="inline-block w-12 h-6 bg-white border border-slate-300 rounded text-center"></span>`).join('')}
                  </div>
                </div>
              `).join('')}
            </div>

            <div class="bg-slate-50 p-2.5 rounded-xl border border-slate-200">
              <strong class="text-xs text-slate-800 block mb-1.5">التمييز القاعدي:</strong>
              ${quiz.ruleDiscriminationItems.map((r, rIdx) => `
                <div class="py-1 text-xs border-b border-slate-200 last:border-0">
                  <p class="font-bold text-slate-900">${rIdx + 1}. ${r.prompt}</p>
                  <div class="flex gap-2 mt-1">
                    ${r.options.map(opt => `<span class="bg-white border border-slate-300 px-2 py-0.5 rounded text-[11px]">[ ] ${opt}</span>`).join('')}
                  </div>
                </div>
              `).join('')}
            </div>
          </div>
        </div>

        <!-- Section 4: Official Mastery Rubric & Stamp -->
        <div class="quiz-rubric-card">
          <div class="rubric-score-col">
            <div class="score-circle">
              <span class="score-title">الدرجة الكلية</span>
              <span class="score-num">....... / ${quiz.masteryScoreMax}</span>
            </div>
            <div class="mastery-stamp-badge">
              <span>ختم إتقان المهارة 🇾🇪</span>
            </div>
          </div>

          <div class="rubric-details-col">
            <div class="rubric-row">
              <span><strong>مستوى الإتقان:</strong> [ ] إتقان تام بنسبة 100% ⭐ &nbsp;&nbsp; [ ] إتقان متقدم &nbsp;&nbsp; [ ] يحتاج إعادة تقويم</span>
            </div>
            <div class="rubric-signatures-row">
              <div><strong>توقيع المعلم/ة: </strong><span>........................</span></div>
              <div><strong>المشرف التربوي: </strong><span>........................</span></div>
              <div><strong>توقيع ولي الأمر: </strong><span>........................</span></div>
            </div>
          </div>
        </div>
      </main>

      <footer class="page-footer">
        <div class="footer-bottom-row">
          <span>🇾🇪 ${countryName} — ${schoolName}</span>
          <span>سجل قياس أثر المهارات القرائية والإملائية — نموذج معتمد</span>
          <span>اختبار الوحدة ${quiz.unitNumber}</span>
        </div>
      </footer>

    </div>
  `;
}

export function generatePrintDocumentHtml({
  pages,
  branding,
  studentName,
  studentGrade,
  studentClass = '١ / أ',
  skills = []
}: {
  pages: BookPage[];
  branding: SchoolBranding;
  studentName: string;
  studentGrade: string;
  studentClass?: string;
  skills?: EvaluationSkill[];
}): string {
  const countryName = branding.countryName || 'الجمهورية اليمنية';
  const ministryName = branding.ministryName || 'وزارة التربية والتعليم والبحث العلمي';
  const governorateName = branding.governorateName || 'أمانة العاصمة / صنعاء';
  const directorateName = branding.directorateName || 'منطقة معين التعليمية';
  const schoolName = branding.schoolName || 'مدارس ابن سيناء الأهلية النموذجية';
  const departmentName = branding.departmentName || 'قسم إدارة الجودة والتطوير التعليمي';
  const programName = branding.programName || 'الخطة العلاجية الشاملة لمهارات القراءة والكتابة';
  const academicYear = branding.academicYear || '1446-1447هـ / 2024-2025م';
  const teacherName = branding.teacherName || '';
  const supervisorName = branding.supervisorName || 'المشرف التربوي';
  const principalName = branding.principalName || 'مدير المدرسة';
  const sName = studentName || branding.studentName || 'طالب متميز';
  const sGrade = studentGrade || branding.studentGrade || 'الصف الأساسي (الأول / الثاني)';
  const sClass = studentClass || branding.studentClass || 'شعبة (أ)';
  const isBooklet = branding.bookletMode;

  const pagesHtml = pages.map((page, index) => {
    const isCover = page.pageType === 'cover';
    const isEvaluation = page.pageType === 'conclusion' || page.pageNumber === 121;
    const isToc = page.pageType === 'toc';
    const pageClass = isBooklet ? (index % 2 === 0 ? 'page-even' : 'page-odd') : '';

    if (isCover) {
      return `
        <div class="print-page cover-page ${branding.inkSaverMode ? 'ink-saver' : ''} ${pageClass}">
          <div class="cover-inner-royal">
            
            <!-- Top Administration Header -->
            <div class="cover-top-header">
              <div class="header-side-col right-col">
                <span class="country-name">${countryName}</span>
                <span class="ministry-name">${ministryName}</span>
                <span class="gov-name">${governorateName}</span>
                <span class="dir-name">${directorateName}</span>
              </div>
              
              <div class="header-center-logo">
                ${branding.logoUrl 
                  ? `<img src="${branding.logoUrl}" class="cover-school-logo-img" alt="شعار المدرسة" />`
                  : `<div class="cover-logo-emblem-badge">
                      <div class="cover-emblem-icon">🇾🇪</div>
                      <strong>${schoolName}</strong>
                    </div>`
                }
              </div>

              <div class="header-side-col left-col">
                <span class="school-bold-title">${schoolName}</span>
                <span class="dept-title">${departmentName}</span>
                <span class="year-badge">${academicYear}</span>
              </div>
            </div>

            <!-- Bismillah Calligraphy -->
            <div class="bismillah-banner font-amiri">
              بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
            </div>

            <!-- Hero Book Title -->
            <div class="cover-hero-section">
              <span class="hero-curriculum-badge">✨ الحقيبة التأسيسية الشاملة لمعالجة الضعف القرائي والإملائي</span>
              <h1 class="hero-main-title font-cairo">الخطة العلاجية لمهارات القراءة والكتابة</h1>
              <div class="hero-gold-separator"></div>
              <p class="hero-main-desc">
                برنامج نوعي متدرج وشامل لمعالجة جوانب القصور القرائي والإملائي وتأسيس الطالب في القراءة السريعة والتحليل الصوتي وقواعد الإملاء وفق معايير وزارة التربية والتعليم
              </p>
              <div class="hero-features-chips">
                <span class="chip">١٢١ صفحة علاجية متكاملة</span>
                <span class="chip">١٥ مهارة تأسيسية</span>
                <span class="chip">شبكة أسطر النسخ الرباعية</span>
                <span class="chip">سجل تقويم وملحق اختبارات الأثر</span>
              </div>
            </div>

            <!-- Student & Administration Profile Card -->
            <div class="cover-profile-card">
              <div class="profile-card-header">
                <span>📋 بطاقة بيانات التلميذ والهيئة التعليمية والإشرافية</span>
              </div>
              <div class="profile-grid">
                <div class="profile-field">
                  <span class="field-label">اسم التلميذ/ة:</span>
                  <span class="field-value">${sName}</span>
                </div>
                <div class="profile-field">
                  <span class="field-label">الصف والشعبة:</span>
                  <span class="field-value">${sGrade} — ${sClass}</span>
                </div>
                <div class="profile-field">
                  <span class="field-label">المدرسة:</span>
                  <span class="field-value">${schoolName}</span>
                </div>
                <div class="profile-field">
                  <span class="field-label">معلم/ة المادة:</span>
                  <span class="field-value">${teacherName || '...................................................'}</span>
                </div>
                <div class="profile-field">
                  <span class="field-label">المشرف التربوي:</span>
                  <span class="field-value">${supervisorName || '...................................................'}</span>
                </div>
                <div class="profile-field">
                  <span class="field-label">مدير المدرسة:</span>
                  <span class="field-value">${principalName || '...................................................'}</span>
                </div>
              </div>
            </div>

            <!-- Royal Cover Bottom Footer -->
            <div class="cover-bottom-footer">
              <span>🇾🇪 ${countryName} — ${ministryName}</span>
              <span>${schoolName} — ${departmentName}</span>
              <span>العام الدراسي: ${academicYear}</span>
            </div>

          </div>
        </div>
      `;
    }

    if (isEvaluation) {
      return `
        <div class="print-page ${branding.inkSaverMode ? 'ink-saver' : ''} ${pageClass}">
          ${renderHeader(page, branding)}
          
          <main class="page-content">
            <div class="eval-title-bar">
              سجل تقويم ومتابعة إتقان المهارات القرائية والإملائية الـ ١٥ (نظام المحاولات الأربع)
            </div>

            <table class="eval-table">
              <thead>
                <tr>
                  <th style="width: 35px; text-align: center;">م</th>
                  <th>المهارة المستهدفة</th>
                  <th style="width: 70px; text-align: center;">الصفحات</th>
                  <th style="width: 110px; text-align: center;">المحاولات (١-٤)</th>
                  <th style="width: 90px; text-align: center;">حالة الإتقان</th>
                  <th>ملاحظات وتوقيع المعلم</th>
                </tr>
              </thead>
              <tbody>
                ${skills.map((skill, sIdx) => {
                  const isMastered = skill.attempts.some(a => a);
                  return `
                    <tr class="${sIdx % 2 === 1 ? 'even-row' : ''}">
                      <td style="text-align: center; font-weight: bold;">${skill.id}</td>
                      <td style="font-weight: bold;">${skill.name}</td>
                      <td style="text-align: center; font-size: 11px;">ص ${skill.pageRef}</td>
                      <td style="text-align: center;">
                        <div class="attempts-flex">
                          ${skill.attempts.map((att, attIdx) => `
                            <span class="att-box ${att ? 'checked' : ''}">${att ? '✓' : attIdx + 1}</span>
                          `).join('')}
                        </div>
                      </td>
                      <td style="text-align: center; font-weight: bold; font-size: 11px;">
                        ${isMastered ? '<span style="color: #065F46;">متقن [✓]</span>' : '<span style="color: #64748b;">[ ] يحتاج تدريب</span>'}
                      </td>
                      <td style="font-size: 11px; color: #94a3b8;">....................................</td>
                    </tr>
                  `;
                }).join('')}
              </tbody>
            </table>
          </main>

          ${renderFooter(page, branding)}
        </div>
      `;
    }

    // Standard Lesson / Worksheet Page
    return `
      <div class="print-page ${branding.inkSaverMode ? 'ink-saver' : ''} ${pageClass}">
        ${renderHeader(page, branding)}

        <main class="page-content">
          ${(page.goal || page.procedure) ? `
            <div class="goal-procedure-bar">
              ${page.goal ? `<div class="goal-item"><strong>🎯 الهدف:</strong> <span>${page.goal}</span></div>` : ''}
              ${page.procedure ? `<div class="procedure-item"><strong>📋 طريقة التنفيذ:</strong> <span>${page.procedure}</span></div>` : ''}
            </div>
          ` : ''}

          ${page.ruleNotice ? `
            <div class="rule-notice-box">
              📌 <strong>إرشاد وتنبيه:</strong> ${page.ruleNotice}
            </div>
          ` : ''}

          ${page.content?.text ? `
            <div class="page-intro-text">${page.content.text}</div>
          ` : ''}

          ${page.pageType === 'unit_cover' ? `
            <div class="unit-cover-sheet">
              <span class="unit-cover-badge">${page.unitTitle}</span>
              <h2 class="unit-cover-title">${page.title}</h2>
              ${page.subtitle ? `<p class="unit-cover-subtitle">${page.subtitle}</p>` : ''}
              <div class="unit-cover-desc">
                تهدف هذه الوحدة لتأسيس الطالب في المهارة المستهدفة بالتدريج عبر القراءة السريعة والتحليل الصوتي والنسخ والتطبيق الإملائي.
              </div>
            </div>
          ` : ''}

          ${page.pageType === 'toc' && page.content?.items ? `
            <div class="section-title">فهرس موضوعات ومهارات الخطة العلاجية (١٢١ صفحة علاجية شاملة):</div>
            <div class="toc-grid">
              ${page.content.items.map(item => `
                <div class="toc-item-card">
                  <span>${item}</span>
                  <span class="toc-status-badge">مكتمل</span>
                </div>
              `).join('')}
            </div>
          ` : ''}

          ${page.content?.ruleBoxes ? `
            <div class="rule-boxes-grid">
              ${page.content.ruleBoxes.map(b => `
                <div class="rule-box-card">
                  <h4>${b.title}</h4>
                  <p>${b.body}</p>
                  <div class="rule-box-example">أمثلة: ${b.example}</div>
                </div>
              `).join('')}
            </div>
          ` : ''}

          ${page.pageType === 'written_tracing' ? `
            <div class="section-title">تدريب كتابي رأسي: اقرأ النموذج ➜ تتبع المقطع المنقط ➜ اكتب المقطع في المحاولات التالية على سطر الأساس:</div>
            <div class="v4-tracing-grid">
              ${(page.content?.gridItems || []).map(item => `
                <div class="v4-tracing-card">
                  <!-- 1. Model Item -->
                  <div class="v4-tier v4-model-tier">
                    <span class="v4-badge">النموذج</span>
                    <span class="v4-word-text font-amiri">${item}</span>
                  </div>
                  <!-- 2. Dotted Tracing (Attempt 1) -->
                  <div class="v4-tier v4-dotted-tier">
                    <span class="v4-badge">١. تتبع منقط ✏️</span>
                    <span class="v4-dotted-text font-amiri arabic-dotted-tracing">${item}</span>
                  </div>
                  <!-- 3. Attempt 2 (Writing) -->
                  <div class="v4-tier v4-write-tier">
                    <span class="v4-badge">٢. اكتب على السطر</span>
                    ${renderHandwritingSlot(branding, 'compact')}
                  </div>
                  <!-- 4. Attempt 3/4 (Mastery Writing) -->
                  <div class="v4-tier v4-write-tier">
                    <span class="v4-badge">٣/٤. كرر للإتقان ⭐</span>
                    ${renderHandwritingSlot(branding, 'compact')}
                  </div>
                </div>
              `).join('')}
            </div>
          ` : ''}

          ${page.pageType === 'dictation_board' ? `
            <div class="dictation-intro-box">
              <h3>لوحة الإملاء الصوتي والاختبار الإملائي</h3>
              <p>استمع للمعلم واكتب الكلمة بدقة على شبكة الأسطر ثم اضبط حركاتها:</p>
            </div>
            <div class="dictation-grid">
              ${Array.from({ length: Math.min(10, Math.max(8, page.content?.dictationSuggestedWords?.length || 8)) }).map((_, dIdx) => `
                <div class="dictation-slot">
                  <div class="dictation-num-label">
                    <span class="dictation-num">${dIdx + 1}</span>
                    <span class="dictation-lbl">الكلمة:</span>
                  </div>
                  <div class="dictation-line">
                    ${renderHandwritingSlot(branding, 'compact')}
                  </div>
                  <span class="dictation-check">[ ] صحيح</span>
                </div>
              `).join('')}
            </div>
            ${page.content?.dictationSuggestedWords ? `
              <div class="dictation-bank">
                <strong>بنك الكلمات والحروف المقترحة للمعلم للإملاء:</strong>
                <div class="dictation-words-list">
                  ${page.content.dictationSuggestedWords.map(w => `<span class="dict-word-tag font-amiri">${w}</span>`).join('')}
                </div>
              </div>
            ` : ''}
          ` : ''}

          ${page.pageType === 'letter_vowels' ? `
            <div class="section-title">اقرأ الحروف بالحركات الثلاث (فتحة - كسرة - ضمة) ثم اكتب كل حرف بخط جميل:</div>
            <div class="letter-vowels-v4-grid">
              ${(page.content?.gridItems || []).map(group => `
                <div class="letter-vowel-v4-card">
                  <div class="v4-tier v4-model-tier">
                    <span class="v4-badge">النموذج</span>
                    <span class="v4-char-text font-amiri">${group}</span>
                  </div>
                  <div class="v4-tier v4-dotted-tier">
                    <span class="v4-badge">١. تتبع</span>
                    <span class="v4-char-dotted font-amiri arabic-dotted-tracing">${group}</span>
                  </div>
                  <div class="v4-tier v4-write-tier">
                    <span class="v4-badge">٢. اكتب</span>
                    ${renderHandwritingSlot(branding, 'compact')}
                  </div>
                  <div class="v4-tier v4-write-tier">
                    <span class="v4-badge">٣/٤. كرر</span>
                    ${renderHandwritingSlot(branding, 'compact')}
                  </div>
                </div>
              `).join('')}
            </div>
          ` : ''}

          ${(page.pageType === 'letter_random' || 
             page.pageType === 'two_letters_reading' || 
             page.pageType === 'words_reading' || 
             page.pageType === 'madd_comparison') ? `
            <div class="words-reading-grid ${
              page.pageType === 'letter_random' ? 'grid-dense' : 
              page.pageType === 'two_letters_reading' ? 'grid-medium' : 'grid-words'
            }">
              ${(page.content?.gridItems || []).map(word => `
                <div class="word-card-v4">
                  <div class="v4-tier v4-model-tier">
                    <span class="v4-badge">النموذج</span>
                    <span class="word-text font-amiri">${word}</span>
                  </div>
                  <div class="v4-tier v4-dotted-tier">
                    <span class="v4-badge">١. تتبع</span>
                    <span class="v4-dotted-text font-amiri arabic-dotted-tracing">${word}</span>
                  </div>
                  <div class="v4-tier v4-write-tier">
                    <span class="v4-badge">٢. اكتب</span>
                    ${renderHandwritingSlot(branding, 'compact')}
                  </div>
                  <div class="v4-tier v4-write-tier">
                    <span class="v4-badge">٣/٤. كرر</span>
                    ${renderHandwritingSlot(branding, 'compact')}
                  </div>
                </div>
              `).join('')}
            </div>
          ` : ''}

          ${page.pageType !== 'letter_vowels' && 
            page.pageType !== 'letter_random' && 
            page.pageType !== 'two_letters_reading' && 
            page.pageType !== 'words_reading' && 
            page.pageType !== 'madd_comparison' && 
            page.pageType !== 'written_tracing' && 
            page.pageType !== 'dictation_board' && 
            page.content?.gridItems ? `
            <div class="words-reading-grid grid-words">
              ${page.content.gridItems.map(word => `
                <div class="word-card-v4">
                  <div class="v4-tier v4-model-tier">
                    <span class="v4-badge">النموذج</span>
                    <span class="word-text font-amiri">${word}</span>
                  </div>
                  <div class="v4-tier v4-dotted-tier">
                    <span class="v4-badge">١. تتبع</span>
                    <span class="v4-dotted-text font-amiri arabic-dotted-tracing">${word}</span>
                  </div>
                  <div class="v4-tier v4-write-tier">
                    <span class="v4-badge">٢. اكتب</span>
                    ${renderHandwritingSlot(branding, 'compact')}
                  </div>
                  <div class="v4-tier v4-write-tier">
                    <span class="v4-badge">٣/٤. كرر</span>
                    ${renderHandwritingSlot(branding, 'compact')}
                  </div>
                </div>
              `).join('')}
            </div>
          ` : ''}

          ${page.pageType === 'connect_and_read' ? `
            <div class="section-title">صل الحروف المنفصلة ➜ تتبع الكلمة المنقطة ➜ اكتب الكلمة في المحاولات التالية:</div>
            <div class="v4-connect-grid">
              ${(page.content?.connectExercises || []).map(ex => `
                <div class="v4-connect-card">
                  <!-- 1. Separated Letters Model -->
                  <div class="v4-tier v4-model-tier">
                    <span class="v4-badge">المقاطع منفصلة (النموذج)</span>
                    <span class="v4-sep-pill font-amiri">${ex.separated}</span>
                  </div>
                  <!-- 2. Dotted Combined Word -->
                  <div class="v4-tier v4-dotted-tier">
                    <span class="v4-badge">١. تتبع الكلمة متصلة ✏️</span>
                    <span class="v4-dotted-text font-amiri arabic-dotted-tracing">${ex.combined}</span>
                  </div>
                  <!-- 3. Attempt 2 -->
                  <div class="v4-tier v4-write-tier">
                    <span class="v4-badge">٢. اكتب الكلمة متصلة</span>
                    ${renderHandwritingSlot(branding, 'compact')}
                  </div>
                  <!-- 4. Attempt 3/4 -->
                  <div class="v4-tier v4-write-tier">
                    <span class="v4-badge">٣/٤. كرر للإتقان ⭐</span>
                    ${renderHandwritingSlot(branding, 'compact')}
                  </div>
                </div>
              `).join('')}
            </div>
          ` : ''}

          ${page.pageType === 'analysis_syllables' ? `
            <div class="section-title">حلل الكلمات إلى مقاطعها الصوتية (الكلمة ➜ المقاطع مفككة ➜ كتابة المقاطع):</div>
            <div class="analysis-grid">
              ${(page.content?.analysisWords || []).map(item => `
                <div class="analysis-card">
                  <div class="analysis-header">
                    <span class="analysis-word font-amiri">${item.word}</span>
                    <div class="syllables-wrap">
                      ${item.syllables.map(s => `<span class="syllable-tag font-amiri arabic-dotted-tracing">${s}</span>`).join('')}
                    </div>
                  </div>
                  <div class="analysis-write-row">
                    <span>كتابة المقاطع:</span>
                    <div class="analysis-slots-row">
                      ${item.syllables.map(() => `
                        <div class="syl-slot-box">
                          ${renderHandwritingSlot(branding, 'compact')}
                        </div>
                      `).join('')}
                    </div>
                  </div>
                </div>
              `).join('')}
            </div>
          ` : ''}

          ${page.pageType === 'sentences_reading' ? `
            <div class="section-title">اقرأ الجمل التالية بطلاقة ➜ تتبع المنقط ➜ اكتب الجملة بخط النسخ الجميل:</div>
            <div class="sentences-v4-list">
              ${(page.content?.sentences || []).map(sent => `
                <div class="sentence-v4-card">
                  <!-- 1. Model Sentence -->
                  <div class="sent-v4-tier sent-v4-model">
                    <span class="sent-v4-badge">النموذج:</span>
                    <span class="sent-v4-text font-amiri">${sent}</span>
                  </div>
                  <!-- 2. Dotted Sentence -->
                  <div class="sent-v4-tier sent-v4-dotted">
                    <span class="sent-v4-badge">١. تتبع:</span>
                    <span class="sent-v4-dotted-text font-amiri arabic-dotted-tracing">${sent}</span>
                  </div>
                  <!-- 3. Write Sentence Attempt 1 -->
                  <div class="sent-v4-tier sent-v4-write">
                    <span class="sent-v4-badge">٢. اكتب:</span>
                    <div class="sent-v4-slot">${renderHandwritingSlot(branding)}</div>
                  </div>
                  <!-- 4. Write Sentence Attempt 2 (Mastery) -->
                  <div class="sent-v4-tier sent-v4-write">
                    <span class="sent-v4-badge">٣/٤. كرر:</span>
                    <div class="sent-v4-slot">${renderHandwritingSlot(branding)}</div>
                  </div>
                </div>
              `).join('')}
            </div>
          ` : ''}

          ${(page.pageType === 'shaddah_extraction' || 
             page.pageType === 'shaddah_sorting' || 
             page.pageType === 'lam_sorting' || 
             page.pageType === 'madd_identification') ? `
            <div class="sorting-grid">
              ${(page.content?.sortingItems || []).map(item => `
                <div class="sorting-card">
                  <span class="sort-word">${item.word}</span>
                  <span class="sort-cat">${item.category}</span>
                </div>
              `).join('')}
            </div>
          ` : ''}

          ${page.pageType === 'ta_ha_picture_blanks' && page.content?.pictureBlanks ? `
            <div class="picture-blanks-grid">
              ${page.content.pictureBlanks.map(item => `
                <div class="pic-blank-card">
                  <div class="pic-emoji">${item.imageEmoji}</div>
                  <div class="pic-word">${item.wordStart} ( .... )</div>
                  <div class="pic-options">
                    ${item.options.map(opt => `<span class="opt-tag">[ ${opt} ]</span>`).join('')}
                  </div>
                </div>
              `).join('')}
            </div>
          ` : ''}

          ${page.pageType === 'ta_ha_coloring' && page.content?.colorItems ? `
            <div class="color-legend">
              <span>🟩 تاء مفتوحة (ت)</span>
              <span>🟥 تاء مربوطة (ـة / ة)</span>
              <span>🟦 هاء (ـه / ه)</span>
            </div>
            <div class="color-items-grid">
              ${page.content.colorItems.map(item => `
                <div class="color-card">
                  <span class="color-word">${item.word}</span>
                  <div class="color-boxes">
                    <span>[ ت ]</span>
                    <span>[ ة ]</span>
                    <span>[ هـ ]</span>
                  </div>
                </div>
              `).join('')}
            </div>
          ` : ''}

          ${page.content?.tableData ? `
            <table class="data-table">
              <thead>
                <tr>
                  <th style="width: 30%;">نوع المهارة</th>
                  <th>أمثلة وتدريبات تطبيقية</th>
                </tr>
              </thead>
              <tbody>
                ${page.content.tableData.map((row: any, rIdx: number) => `
                  <tr class="${rIdx % 2 === 1 ? 'even-row' : ''}">
                    <td class="table-type-cell">${row.type}</td>
                    <td class="table-example-cell">${row.example}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          ` : ''}

        </main>

        ${renderFooter(page, branding)}
      </div>
    `;
  }).join('');

  return `
    <!DOCTYPE html>
    <html lang="ar" dir="rtl">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${schoolName} — الخطة العلاجية لمهارات القراءة والكتابة</title>
      <link rel="preconnect" href="https://fonts.googleapis.com">
      <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
      <link href="https://fonts.googleapis.com/css2?family=Amiri:wght@400;700&family=Cairo:wght@400;600;700;800;900&family=Tajawal:wght@400;500;700;800;900&display=swap" rel="stylesheet">
      <style>
        * {
          box-sizing: border-box;
          margin: 0;
          padding: 0;
        }
        body {
          font-family: 'Cairo', 'Tajawal', sans-serif;
          background: #f1ede7;
          color: #0f172a;
          direction: rtl;
          text-align: right;
          font-size: 13px;
          line-height: 1.5;
        }

        .font-amiri {
          font-family: 'Amiri', serif;
        }

        /* Top Action Bar (hidden on print) */
        .print-control-bar {
          position: sticky;
          top: 0;
          z-index: 999;
          background: #064e3b;
          color: white;
          padding: 12px 20px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          box-shadow: 0 4px 12px rgba(0,0,0,0.15);
          font-family: 'Cairo', sans-serif;
        }
        .print-control-bar h2 {
          font-size: 15px;
          font-weight: 800;
        }
        .print-control-bar p {
          font-size: 11px;
          opacity: 0.85;
        }
        .btn-print {
          background: #f59e0b;
          color: #0f172a;
          font-weight: 900;
          font-size: 14px;
          padding: 8px 22px;
          border: none;
          border-radius: 12px;
          cursor: pointer;
          transition: all 0.2s;
          display: flex;
          align-items: center;
          gap: 6px;
          box-shadow: 0 2px 6px rgba(0,0,0,0.2);
        }
        .btn-print:hover {
          background: #fbbf24;
          transform: scale(1.03);
        }

        /* Page Container */
        .print-document-wrap {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 24px;
          padding: 24px 12px;
        }

        .print-page {
          width: 210mm;
          min-height: 297mm;
          background: white;
          padding: 12mm 14mm;
          box-sizing: border-box;
          box-shadow: 0 4px 20px rgba(0,0,0,0.08);
          border-radius: 8px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          position: relative;
          page-break-after: always;
          break-after: page;
        }

        /* Header */
        .page-header {
          border-bottom: 2px solid #0f172a;
          padding-bottom: 10px;
          margin-bottom: 14px;
        }
        .header-top-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
        }
        .school-branding-group {
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .school-logo-img {
          width: 50px;
          height: 50px;
          object-fit: contain;
          border-radius: 8px;
        }
        .school-logo-vector {
          width: 48px;
          height: 48px;
        }
        .school-titles h1 {
          font-size: 15px;
          font-weight: 900;
          color: #064e3b;
          line-height: 1.2;
        }
        .country-line {
          font-size: 10px;
          font-weight: 800;
          color: #064e3b;
          margin-bottom: 2px;
        }
        .school-titles p {
          font-size: 11px;
          font-weight: 700;
          color: #92400e;
        }
        .school-titles .prog-title {
          font-size: 10px;
          font-weight: 600;
          color: #475569;
        }
        .header-center-title {
          text-align: center;
        }
        .unit-badge {
          display: inline-block;
          background: #f1f5f9;
          border: 1.5px solid #64748b;
          color: #0f172a;
          padding: 2px 10px;
          border-radius: 20px;
          font-size: 11px;
          font-weight: 800;
        }
        .page-main-title {
          font-size: 13px;
          font-weight: 900;
          color: #0f172a;
          margin-top: 3px;
        }
        .page-num-badge {
          background: #0f172a;
          color: white;
          font-weight: 900;
          font-size: 16px;
          width: 38px;
          height: 38px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto;
        }
        .page-num-sub {
          font-size: 9px;
          color: #64748b;
          font-weight: bold;
          margin-top: 2px;
          text-align: center;
        }

        /* Student Info Bar */
        .student-info-bar {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 6px;
          background: #f8fafc;
          border: 1px solid #cbd5e1;
          border-radius: 6px;
          padding: 5px 8px;
          margin-top: 8px;
          font-size: 11px;
        }
        .student-info-bar .info-item strong {
          color: #475569;
        }
        .student-info-bar .info-item span {
          font-weight: 800;
          color: #0f172a;
        }

        /* Body Content */
        .page-content {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .goal-procedure-bar {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 8px;
          background: #f8fafc;
          border: 1px solid #cbd5e1;
          border-radius: 8px;
          padding: 6px 10px;
          font-size: 11px;
        }
        .goal-item strong, .procedure-item strong {
          color: #064e3b;
        }

        .rule-notice-box {
          background: #fef3c7;
          border-right: 4px solid #d97706;
          border-radius: 6px;
          padding: 6px 10px;
          font-size: 12px;
          font-weight: 700;
          color: #78350f;
        }

        .page-intro-text {
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          padding: 12px;
          font-size: 13px;
          line-height: 1.6;
        }

        .section-title {
          font-size: 12px;
          font-weight: 800;
          color: #1e293b;
        }

        /* Letter Vowels Grid */
        .letter-vowels-grid {
          display: grid;
          grid-template-columns: repeat(7, 1fr);
          gap: 8px;
        }
        .letter-vowel-card {
          border: 2px solid #0f172a;
          border-radius: 8px;
          padding: 8px 4px;
          text-align: center;
          background: white;
        }
        .letter-vowel-char {
          font-size: 22px;
          font-weight: 900;
          color: #0f172a;
          font-family: 'Amiri', serif;
        }
        .handwriting-line {
          margin-top: 6px;
          height: 16px;
          border-bottom: 1.5px dashed #94a3b8;
        }

        /* Words Grids */
        .words-reading-grid {
          display: grid;
          gap: 8px;
        }
        .grid-dense {
          grid-template-columns: repeat(8, 1fr);
        }
        .grid-medium {
          grid-template-columns: repeat(6, 1fr);
        }
        .grid-words {
          grid-template-columns: repeat(4, 1fr);
        }
        .word-card {
          border: 2px solid #0f172a;
          border-radius: 8px;
          padding: 8px 6px;
          text-align: center;
          background: white;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          min-height: 60px;
        }
        .word-text {
          font-size: 22px;
          font-weight: 900;
          color: #020617;
          display: block;
        }
        .handwriting-dotted-line {
          width: 100%;
          margin-top: 6px;
          border-bottom: 2px dotted #64748b;
          height: 14px;
        }

        /* Connect and Read */
        .connect-exercises-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 8px;
        }
        .connect-card {
          border: 2px solid #0f172a;
          border-radius: 8px;
          padding: 8px 12px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          background: white;
        }
        .connect-pair {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 15px;
          font-weight: 800;
        }
        .sep-pill {
          background: #f1f5f9;
          border: 1px solid #94a3b8;
          padding: 2px 8px;
          border-radius: 6px;
          font-size: 14px;
        }
        .comb-pill {
          font-size: 20px;
          font-weight: 900;
          font-family: 'Amiri', serif;
        }
        .handwriting-box {
          width: 90px;
          height: 20px;
          border-bottom: 2px dotted #475569;
        }

        /* Analysis Syllables */
        .analysis-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 8px;
        }
        .analysis-card {
          border: 2px solid #0f172a;
          border-radius: 8px;
          padding: 8px 10px;
          background: white;
        }
        .analysis-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          border-bottom: 1px solid #cbd5e1;
          padding-bottom: 6px;
        }
        .analysis-word {
          font-size: 20px;
          font-weight: 900;
          font-family: 'Amiri', serif;
        }
        .syllables-wrap {
          display: flex;
          gap: 4px;
        }
        .syllable-tag {
          background: #f8fafc;
          border: 1px solid #94a3b8;
          padding: 2px 6px;
          border-radius: 4px;
          font-size: 12px;
          font-weight: 800;
        }
        .analysis-write-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-top: 6px;
          font-size: 11px;
          color: #64748b;
        }
        .write-line {
          width: 140px;
          height: 16px;
          border-bottom: 2px dotted #475569;
        }

        /* Sentences */
        .sentences-list {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        .sentence-card {
          border: 2px solid #0f172a;
          border-radius: 8px;
          padding: 10px 14px;
          background: white;
        }
        .sentence-text {
          font-size: 20px;
          font-weight: 900;
          color: #020617;
          line-height: 1.4;
        }
        .sentence-write-line {
          margin-top: 8px;
          height: 20px;
          border-bottom: 2px dotted #64748b;
        }

        /* Sorting */
        .sorting-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 8px;
        }
        .sorting-card {
          border: 2px solid #334155;
          border-radius: 8px;
          padding: 6px 10px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          background: white;
        }
        .sort-word {
          font-size: 15px;
          font-weight: 900;
          font-family: 'Amiri', serif;
        }
        .sort-cat {
          background: #f1f5f9;
          border: 1px solid #94a3b8;
          padding: 1px 6px;
          border-radius: 4px;
          font-size: 11px;
          font-weight: 700;
        }

        /* Picture Blanks */
        .picture-blanks-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 8px;
        }
        .pic-blank-card {
          border: 2px solid #0f172a;
          border-radius: 8px;
          padding: 8px 4px;
          text-align: center;
          background: white;
        }
        .pic-emoji {
          font-size: 28px;
          margin-bottom: 4px;
        }
        .pic-word {
          font-size: 15px;
          font-weight: 900;
          margin-bottom: 6px;
        }
        .pic-options {
          display: flex;
          justify-content: center;
          gap: 3px;
          font-size: 10px;
        }
        .opt-tag {
          background: #f8fafc;
          border: 1px solid #cbd5e1;
          padding: 1px 4px;
          border-radius: 4px;
        }

        /* Coloring */
        .color-legend {
          background: #f1f5f9;
          border: 1px solid #cbd5e1;
          border-radius: 6px;
          padding: 6px 12px;
          display: flex;
          justify-content: space-between;
          font-size: 11px;
          font-weight: 800;
        }
        .color-items-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 8px;
        }
        .color-card {
          border: 2px solid #0f172a;
          border-radius: 8px;
          padding: 8px 4px;
          text-align: center;
          background: white;
        }
        .color-word {
          font-size: 15px;
          font-weight: 900;
          display: block;
          margin-bottom: 4px;
        }
        .color-boxes {
          display: flex;
          justify-content: center;
          gap: 2px;
          font-size: 9px;
        }
        .color-boxes span {
          border: 1px solid #cbd5e1;
          padding: 1px 3px;
          border-radius: 3px;
        }

        /* Unit Cover Sheet */
        .unit-cover-sheet {
          border: 2px solid #0f172a;
          border-radius: 16px;
          background: #f8fafc;
          padding: 30px 20px;
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 16px;
          margin: 20px 0;
        }
        .unit-cover-badge {
          display: inline-block;
          background: #e2e8f0;
          border: 1.5px solid #475569;
          color: #0f172a;
          padding: 4px 14px;
          border-radius: 20px;
          font-size: 13px;
          font-weight: 900;
        }
        .unit-cover-title {
          font-size: 26px;
          font-weight: 900;
          color: #020617;
        }
        .unit-cover-subtitle {
          font-size: 15px;
          font-weight: 700;
          color: #334155;
          border-top: 1px solid #cbd5e1;
          border-bottom: 1px solid #cbd5e1;
          padding: 8px 16px;
          max-width: 480px;
        }
        .unit-cover-desc {
          background: white;
          border: 1px solid #cbd5e1;
          border-radius: 10px;
          padding: 10px 16px;
          font-size: 12px;
          font-weight: 700;
          color: #475569;
          max-width: 460px;
          line-height: 1.6;
        }

        /* TOC Grid */
        .toc-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 8px;
        }
        .toc-item-card {
          border: 2px solid #0f172a;
          border-radius: 8px;
          padding: 8px 12px;
          background: white;
          display: flex;
          align-items: center;
          justify-content: space-between;
          font-size: 12px;
          font-weight: 800;
        }
        .toc-status-badge {
          background: #f1f5f9;
          border: 1px solid #cbd5e1;
          padding: 2px 6px;
          border-radius: 4px;
          font-size: 10px;
          color: #475569;
        }

        /* Arabic Dotted Tracing Style (نمط التتبع المنقط) */
        .arabic-dotted-tracing {
          font-family: 'Amiri', 'Traditional Arabic', serif;
          color: #475569 !important;
          opacity: 0.75 !important;
          letter-spacing: 1.5px;
          user-select: none;
          font-weight: 700;
          display: inline-block;
          direction: rtl;
        }

        /* ========================================================================= */
        /* VERTICAL 4-ATTEMPT HANDWRITING & TRACING STYLES (التنسيق الرأسي رباعي المستويات) */
        /* ========================================================================= */
        .v4-tracing-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 8px;
        }
        @media (max-width: 768px) {
          .v4-tracing-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }
        .v4-tracing-card, .v4-connect-card, .word-card-v4, .letter-vowel-v4-card {
          border: 2px solid #0f172a;
          border-radius: 10px;
          padding: 6px;
          background: #ffffff;
          display: flex;
          flex-direction: column;
          gap: 4px;
          box-shadow: 0 1px 3px rgba(0,0,0,0.03);
          page-break-inside: avoid;
        }
        .v4-tier {
          border-radius: 6px;
          padding: 4px 6px;
          display: flex;
          flex-direction: column;
          justify-content: center;
          position: relative;
        }
        .v4-model-tier {
          background: #f8fafc;
          border: 1px solid #94a3b8;
          text-align: center;
          min-height: 52px;
        }
        .v4-dotted-tier {
          background: #fafaf9;
          border: 1.5px dashed #64748b;
          text-align: center;
          min-height: 52px;
        }
        .v4-write-tier {
          background: #ffffff;
          border: 1.5px solid #0f172a;
          min-height: 48px;
          padding: 3px 5px;
        }
        .v4-badge {
          font-size: 10px;
          font-weight: 800;
          color: #475569;
          display: block;
          margin-bottom: 1px;
          text-align: right;
        }
        .v4-word-text {
          font-size: 32px;
          font-weight: 900;
          color: #020617;
          line-height: 1.25;
          text-align: center;
          display: block;
        }
        .v4-dotted-text {
          font-size: 32px;
          font-weight: 900;
          line-height: 1.25;
          text-align: center;
          display: block;
        }
        .v4-char-text {
          font-size: 28px;
          font-weight: 900;
          color: #020617;
          text-align: center;
          line-height: 1.25;
        }
        .v4-char-dotted {
          font-size: 28px;
          font-weight: 900;
          text-align: center;
          line-height: 1.25;
        }
        .v4-sep-pill {
          font-size: 22px;
          font-weight: 900;
          color: #064e3b;
          text-align: center;
          background: #ecfdf5;
          border: 1.5px solid #a7f3d0;
          border-radius: 6px;
          padding: 3px 8px;
          display: inline-block;
          margin: 0 auto;
        }

        /* 4-Attempt Connect Grid */
        .v4-connect-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 8px;
        }

        /* 4-Attempt Letter Vowels Grid */
        .letter-vowels-v4-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 6px;
        }

        /* 4-Attempt Sentences List */
        .sentences-v4-list {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        .sentence-v4-card {
          border: 2px solid #0f172a;
          border-radius: 10px;
          padding: 8px 12px;
          background: #ffffff;
          display: flex;
          flex-direction: column;
          gap: 6px;
          page-break-inside: avoid;
        }
        .sent-v4-tier {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 4px 8px;
          border-radius: 6px;
        }
        .sent-v4-model {
          background: #f8fafc;
          border: 1px solid #94a3b8;
        }
        .sent-v4-dotted {
          background: #fafaf9;
          border: 1.5px dashed #64748b;
        }
        .sent-v4-write {
          background: #ffffff;
          border: 1.5px solid #0f172a;
        }
        .sent-v4-badge {
          font-size: 11.5px;
          font-weight: 900;
          color: #334155;
          min-width: 65px;
        }
        .sent-v4-text {
          font-size: 26px;
          font-weight: 900;
          color: #020617;
          flex: 1;
        }
        .sent-v4-dotted-text {
          font-size: 26px;
          font-weight: 900;
          flex: 1;
        }
        .sent-v4-slot {
          flex: 1;
        }

        /* 3-Step Tracing Grid (Legacy Fallback) */
        .tracing-grid-3step {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 10px;
        }
        .tracing-card-3step {
          border: 2px solid #0f172a;
          border-radius: 10px;
          padding: 8px;
          background: white;
          display: grid;
          grid-template-columns: 1fr 1fr 1.2fr;
          gap: 8px;
          box-shadow: 0 1px 3px rgba(0,0,0,0.03);
        }
        .tracing-step-col {
          border: 1px solid #cbd5e1;
          border-radius: 8px;
          padding: 6px 4px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: space-between;
          text-align: center;
          min-height: 68px;
        }
        .tracing-step-col.model-col {
          background: #f8fafc;
          border-color: #94a3b8;
        }
        .tracing-step-col.dotted-col {
          background: #fafaf9;
          border: 1.5px dashed #94a3b8;
        }
        .tracing-step-col.empty-col {
          background: white;
          border: 1.5px solid #0f172a;
        }
        .step-lbl {
          font-size: 10px;
          font-weight: 800;
          color: #475569;
          display: block;
          margin-bottom: 2px;
        }
        .step-text {
          font-size: 30px;
          font-weight: 900;
          color: #020617;
          line-height: 1.25;
        }
        .tracing-step-col .handwriting-dotted-line {
          width: 95%;
          height: 16px;
          border-bottom: 2px dotted #0f172a;
          margin-top: auto;
        }

        /* 3-Step Connect Grid */
        .connect-exercises-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 10px;
        }
        .connect-card-3step {
          border: 2px solid #0f172a;
          border-radius: 10px;
          padding: 8px 10px;
          background: white;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 8px;
          box-shadow: 0 1px 3px rgba(0,0,0,0.03);
        }
        .connect-step-col {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
        }
        .connect-step-col.sep-col .sep-pill {
          background: #f1f5f9;
          border: 1.5px solid #94a3b8;
          padding: 4px 10px;
          border-radius: 8px;
          font-size: 22px;
          font-weight: 900;
        }
        .connect-step-col.dotted-col {
          border: 1.5px dashed #94a3b8;
          padding: 4px 10px;
          border-radius: 8px;
          background: #fafaf9;
        }
        .connect-step-col.dotted-col .comb-pill {
          font-size: 30px;
          font-weight: 900;
        }
        .connect-step-col.empty-col {
          border: 1.5px solid #0f172a;
          padding: 4px 10px;
          border-radius: 8px;
          min-width: 80px;
          flex: 1;
        }

        /* Analysis Slots Row */
        .analysis-slots-row {
          display: flex;
          gap: 6px;
        }
        .syl-slot-box {
          min-width: 52px;
          height: 36px;
          border: 1.5px solid #0f172a;
          border-radius: 6px;
          background: white;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 2px 4px;
        }

        /* Tracing Grid (Standard) */
        .tracing-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 10px;
        }
        .tracing-card {
          border: 2px solid #0f172a;
          border-radius: 10px;
          padding: 10px;
          background: white;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          min-height: 95px;
        }
        .tracing-word {
          font-size: 32px;
          font-weight: 900;
          color: #020617;
          text-align: center;
          border-bottom: 1px solid #e2e8f0;
          padding-bottom: 4px;
        }
        .tracing-write-area {
          margin-top: 6px;
        }
        .tracing-label {
          font-size: 10px;
          font-weight: 800;
          color: #64748b;
          display: block;
          margin-bottom: 2px;
        }

        /* Dictation Board */
        .dictation-intro-box {
          background: #f8fafc;
          border: 1.5px solid #064e3b;
          border-radius: 10px;
          padding: 10px 14px;
          text-align: center;
        }
        .dictation-intro-box h3 {
          font-size: 15px;
          font-weight: 900;
          color: #064e3b;
        }
        .dictation-intro-box p {
          font-size: 12px;
          font-weight: 700;
          color: #334155;
        }
        .dictation-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 10px;
        }
        .dictation-slot {
          border: 2px solid #0f172a;
          border-radius: 10px;
          padding: 8px 12px;
          background: white;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 8px;
        }
        .dictation-num-label {
          display: flex;
          align-items: center;
          gap: 6px;
        }
        .dictation-num {
          width: 24px;
          height: 24px;
          background: #064e3b;
          color: white;
          border-radius: 50%;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          font-size: 12px;
          font-weight: 900;
        }
        .dictation-lbl {
          font-size: 12px;
          font-weight: 800;
          color: #334155;
        }
        .dictation-line {
          flex: 1;
          margin: 0 6px;
        }
        .dictation-check {
          border: 1px solid #cbd5e1;
          border-radius: 6px;
          padding: 3px 6px;
          font-size: 10px;
          font-weight: 800;
          color: #64748b;
          white-space: nowrap;
        }
        .dictation-bank {
          background: #f8fafc;
          border: 1.5px dashed #064e3b;
          border-radius: 10px;
          padding: 10px 14px;
        }
        .dictation-bank strong {
          font-size: 12px;
          font-weight: 900;
          color: #064e3b;
          display: block;
          margin-bottom: 6px;
        }
        .dictation-words-list {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }
        .dict-word-tag {
          background: white;
          border: 1.5px solid #059669;
          border-radius: 8px;
          padding: 4px 12px;
          font-size: 16px;
          font-weight: 900;
          color: #064e3b;
        }

        /* Rule Boxes */
        .rule-boxes-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 8px;
        }
        .rule-box-card {
          border: 2px solid #334155;
          border-radius: 8px;
          padding: 10px;
          background: white;
        }
        .rule-box-card h4 {
          font-size: 13px;
          font-weight: 900;
          color: #064e3b;
          border-bottom: 1px solid #cbd5e1;
          padding-bottom: 4px;
          margin-bottom: 6px;
        }
        .rule-box-card p {
          font-size: 12px;
          color: #334155;
          margin-bottom: 6px;
        }
        .rule-box-example {
          background: #f8fafc;
          border: 1px solid #cbd5e1;
          border-radius: 4px;
          padding: 4px 8px;
          font-size: 11px;
          font-weight: 800;
        }

        /* Tables */
        .data-table, .eval-table {
          width: 100%;
          border-collapse: collapse;
          border: 2px solid #0f172a;
          border-radius: 8px;
          overflow: hidden;
          font-size: 12px;
        }
        .data-table th, .eval-table th {
          background: #e2e8f0;
          border: 1px solid #64748b;
          padding: 6px 8px;
          font-weight: 900;
          color: #0f172a;
        }
        .data-table td, .eval-table td {
          border: 1px solid #cbd5e1;
          padding: 5px 8px;
        }
        .even-row {
          background: #f8fafc;
        }
        .table-type-cell {
          font-weight: 900;
          background: #f1f5f9;
        }
        .eval-title-bar {
          background: #f1f5f9;
          border: 1px solid #64748b;
          padding: 8px;
          border-radius: 8px;
          text-align: center;
          font-weight: 900;
          font-size: 12px;
          color: #0f172a;
        }
        .attempts-flex {
          display: flex;
          justify-content: center;
          gap: 3px;
        }
        .att-box {
          width: 18px;
          height: 18px;
          border: 1px solid #64748b;
          border-radius: 3px;
          font-size: 10px;
          font-weight: 900;
          display: inline-flex;
          align-items: center;
          justify-content: center;
        }
        .att-box.checked {
          background: #0f172a;
          color: white;
          border-color: #0f172a;
        }

        /* Cover Page Styling */
        .cover-page {
          border: 4px double #064e3b;
          padding: 12mm 12mm;
          background: #ffffff;
        }
        .cover-inner-royal {
          height: 100%;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          align-items: center;
          text-align: center;
          border: 2px solid #064e3b;
          border-radius: 16px;
          padding: 14px;
          background: radial-gradient(circle at center, #ffffff 0%, #fbfdfc 100%);
        }
        .cover-top-header {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: space-between;
          border-bottom: 2px solid #064e3b;
          padding-bottom: 10px;
        }
        .header-side-col {
          display: flex;
          flex-direction: column;
          gap: 2px;
          font-size: 11px;
          font-weight: 800;
        }
        .header-side-col.right-col {
          text-align: right;
          color: #0f172a;
        }
        .header-side-col.left-col {
          text-align: left;
          color: #064e3b;
        }
        .country-name {
          font-size: 13px;
          font-weight: 900;
          color: #064e3b;
        }
        .ministry-name {
          font-size: 11px;
          font-weight: 800;
          color: #0f172a;
        }
        .gov-name, .dir-name {
          font-size: 10px;
          color: #475569;
        }
        .school-bold-title {
          font-size: 14px;
          font-weight: 900;
          color: #064e3b;
        }
        .dept-title {
          font-size: 11px;
          font-weight: 700;
          color: #92400e;
        }
        .year-badge {
          display: inline-block;
          font-size: 10px;
          font-weight: 800;
          color: #0f172a;
          background: #fef3c7;
          border: 1px solid #d97706;
          padding: 1px 6px;
          border-radius: 6px;
          margin-top: 2px;
        }
        .header-center-logo {
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .cover-school-logo-img {
          width: 75px;
          height: 75px;
          object-fit: contain;
          border-radius: 12px;
          border: 2px solid #064e3b;
          padding: 2px;
          background: white;
        }
        .cover-logo-emblem-badge {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 2px;
          background: #f0fdf4;
          border: 2px solid #059669;
          padding: 6px 12px;
          border-radius: 12px;
          font-size: 10px;
          color: #064e3b;
        }
        .cover-emblem-icon {
          font-size: 22px;
        }
        .bismillah-banner {
          font-size: 20px;
          font-weight: bold;
          color: #064e3b;
          margin: 6px 0;
          letter-spacing: 1px;
        }
        .cover-hero-section {
          margin: 10px 0;
          max-width: 580px;
        }
        .hero-curriculum-badge {
          display: inline-block;
          background: #fef3c7;
          border: 1.5px solid #d97706;
          color: #78350f;
          padding: 4px 16px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 900;
          margin-bottom: 8px;
        }
        .hero-main-title {
          font-size: 26px;
          font-weight: 900;
          color: #064e3b;
          line-height: 1.3;
          text-shadow: 0 1px 2px rgba(0,0,0,0.05);
        }
        .hero-gold-separator {
          width: 140px;
          height: 4px;
          background: linear-gradient(90deg, transparent, #d97706, transparent);
          border-radius: 2px;
          margin: 8px auto;
        }
        .hero-main-desc {
          font-size: 12px;
          font-weight: 700;
          color: #334155;
          line-height: 1.6;
          padding: 0 10px;
        }
        .hero-features-chips {
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          gap: 6px;
          margin-top: 10px;
        }
        .hero-features-chips .chip {
          background: #f1f5f9;
          border: 1px solid #cbd5e1;
          color: #0f172a;
          padding: 2px 8px;
          border-radius: 6px;
          font-size: 10px;
          font-weight: 800;
        }
        .cover-profile-card {
          width: 100%;
          max-width: 540px;
          background: #ffffff;
          border: 2px solid #064e3b;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 2px 4px rgba(0,0,0,0.04);
        }
        .profile-card-header {
          background: #064e3b;
          color: #ffffff;
          padding: 5px 10px;
          font-size: 11px;
          font-weight: 900;
          text-align: center;
        }
        .profile-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 6px 12px;
          padding: 10px 14px;
          text-align: right;
          font-size: 12px;
        }
        .profile-field {
          display: flex;
          align-items: center;
          justify-content: space-between;
          border-bottom: 1px dashed #cbd5e1;
          padding-bottom: 3px;
        }
        .field-label {
          color: #475569;
          font-weight: 800;
          font-size: 11px;
        }
        .field-value {
          color: #0f172a;
          font-weight: 900;
          font-size: 12px;
        }
        .cover-bottom-footer {
          width: 100%;
          border-top: 2px solid #064e3b;
          padding-top: 8px;
          display: flex;
          justify-content: space-between;
          font-size: 10px;
          font-weight: 800;
          color: #475569;
        }

        /* Footer */
        .page-footer {
          margin-top: 12px;
          padding-top: 8px;
          border-top: 2px solid #0f172a;
        }
        .eval-box-grid {
          display: grid;
          grid-template-columns: 1.2fr 1fr 1fr;
          gap: 8px;
          background: #f8fafc;
          border: 1px solid #64748b;
          border-radius: 8px;
          padding: 6px 10px;
          font-size: 11px;
          margin-bottom: 6px;
        }
        .eval-box-grid strong {
          color: #0f172a;
        }
        .footer-bottom-row {
          display: flex;
          justify-content: space-between;
          font-size: 10px;
          font-weight: 700;
          color: #64748b;
        }

        /* 4-Line Arabic Handwriting Grid System */
        .arabic-4line-container {
          position: relative;
          width: 100%;
          height: 38px;
          margin: 4px 0;
          background: #ffffff;
          box-sizing: border-box;
          direction: rtl;
        }
        .arabic-4line-container.compact {
          height: 32px;
          margin: 2px 0;
        }
        .grid-line {
          position: absolute;
          left: 0;
          right: 0;
          width: 100%;
        }
        .line-ascender {
          top: 0px;
          border-top: 1px dashed #ef4444;
          opacity: 0.85;
        }
        .line-waist {
          top: 10px;
          border-top: 1px dotted #3b82f6;
          opacity: 0.85;
        }
        .line-base {
          top: 22px;
          border-top: 1.8px solid #059669;
          z-index: 2;
        }
        .line-descender {
          top: 34px;
          border-top: 1px dashed #f59e0b;
          opacity: 0.85;
        }
        .arabic-4line-container.compact .line-ascender { top: 0px; }
        .arabic-4line-container.compact .line-waist { top: 8px; }
        .arabic-4line-container.compact .line-base { top: 18px; border-top-width: 1.8px; }
        .arabic-4line-container.compact .line-descender { top: 28px; }
        .grid-guide-indicator {
          position: absolute;
          right: 2px;
          top: 12px;
          font-size: 8px;
          color: #059669;
          opacity: 0.6;
          user-select: none;
        }

        /* QR Code Header Badge */
        .qr-code-header-badge {
          display: flex;
          flex-direction: column;
          align-items: center;
          background: #f8fafc;
          border: 1px solid #cbd5e1;
          border-radius: 8px;
          padding: 2px 5px;
          text-align: center;
        }
        .qr-svg-wrap {
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .qr-svg-wrap svg {
          width: 38px;
          height: 38px;
        }
        .qr-sub-text {
          font-size: 8px;
          font-weight: 800;
          color: #0f172a;
          margin-top: 1px;
          white-space: nowrap;
        }

        /* Booklet Mode Alternating Margins */
        .booklet-mode-page.page-odd {
          padding-right: 18mm !important;
          padding-left: 10mm !important;
          border-right: 2px dashed #94a3b8;
        }
        .booklet-mode-page.page-even {
          padding-left: 18mm !important;
          padding-right: 10mm !important;
          border-left: 2px dashed #94a3b8;
        }

        /* Quiz Mastery Styles */
        .quiz-mastery-page {
          background: #ffffff;
        }
        .quiz-header-border {
          border-bottom: 2.5px solid #064e3b;
        }
        .quiz-section-block {
          background: #ffffff;
          border: 1.5px solid #064e3b;
          border-radius: 10px;
          padding: 8px 12px;
          margin-bottom: 8px;
        }
        .quiz-section-header {
          display: flex;
          align-items: center;
          gap: 8px;
          border-bottom: 1px dashed #cbd5e1;
          padding-bottom: 4px;
          margin-bottom: 6px;
        }
        .q-sec-badge {
          background: #064e3b;
          color: #ffffff;
          width: 20px;
          height: 20px;
          border-radius: 6px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          font-weight: 900;
          font-size: 11px;
        }
        .q-sec-title {
          font-weight: 800;
          font-size: 12px;
          color: #064e3b;
          flex: 1;
        }
        .q-sec-timer-box {
          background: #fef3c7;
          border: 1px solid #d97706;
          color: #78350f;
          padding: 2px 8px;
          border-radius: 6px;
          font-size: 11px;
          font-weight: 800;
        }
        .fluency-benchmark-bar {
          display: flex;
          align-items: center;
          gap: 10px;
          background: #f8fafc;
          border: 1px solid #cbd5e1;
          border-radius: 6px;
          padding: 4px 8px;
          font-size: 10px;
          margin-top: 4px;
        }
        .bench-tag {
          padding: 1px 6px;
          border-radius: 4px;
          font-weight: 700;
        }
        .tag-exc { background: #dcfce7; color: #166534; }
        .tag-good { background: #dbeafe; color: #1e40af; }
        .tag-train { background: #fee2e2; color: #991b1b; }
        .quiz-dictation-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 6px;
          margin-top: 4px;
        }
        .quiz-dict-slot {
          background: #f8fafc;
          border: 1px solid #94a3b8;
          border-radius: 8px;
          padding: 4px 6px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
        }
        .dict-slot-num {
          font-size: 10px;
          font-weight: 900;
          color: #064e3b;
        }
        .dict-slot-check {
          font-size: 9px;
          color: #64748b;
          text-align: left;
        }
        .quiz-rubric-card {
          display: grid;
          grid-template-columns: 140px 1fr;
          gap: 10px;
          background: #fdfbf7;
          border: 2px solid #d97706;
          border-radius: 12px;
          padding: 8px 12px;
        }
        .rubric-score-col {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 4px;
          border-left: 1px dashed #d97706;
          padding-left: 8px;
        }
        .score-circle {
          text-align: center;
        }
        .score-title {
          display: block;
          font-size: 10px;
          font-weight: 800;
          color: #78350f;
        }
        .score-num {
          font-size: 16px;
          font-weight: 900;
          color: #064e3b;
        }
        .mastery-stamp-badge {
          border: 2px dashed #059669;
          background: #ecfdf5;
          color: #065f46;
          font-size: 9px;
          font-weight: 900;
          padding: 3px 6px;
          border-radius: 6px;
          text-align: center;
        }
        .rubric-details-col {
          display: flex;
          flex-direction: column;
          justify-content: space-around;
          font-size: 11px;
        }
        .rubric-signatures-row {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 6px;
          font-size: 10px;
          border-top: 1px dashed #cbd5e1;
          padding-top: 4px;
        }

        /* Ink Saver Mode */
        .ink-saver {
          filter: grayscale(100%) contrast(120%);
        }

        /* PRINT MEDIA RULES */
        @page {
          size: A4 portrait;
          margin: 6mm 6mm 6mm 6mm;
        }

        @media print {
          body {
            background: white !important;
            color: black !important;
          }
          .print-control-bar {
            display: none !important;
          }
          .print-document-wrap {
            padding: 0 !important;
            gap: 0 !important;
          }
          .print-page {
            box-shadow: none !important;
            border-radius: 0 !important;
            width: 100% !important;
            min-height: 285mm !important;
            margin: 0 !important;
            padding: 6mm 8mm !important;
          }
        }
      </style>
    </head>
    <body>
      <div class="print-control-bar">
        <div>
          <h2>🖨️ ${schoolName} — معاينة وجاهزية الطباعة (${pages.length} صفحة)</h2>
          <p>اضغط زر "طباعة الآن / حفظ كـ PDF" للبدء بالطباعة أو حفظ المنهج بجودة عالية</p>
        </div>
        <button class="btn-print" onclick="window.print()">
          <span>🖨️ طباعة الآن / حفظ كـ PDF</span>
        </button>
      </div>

      <div class="print-document-wrap">
        ${pagesHtml}
      </div>

      <script>
        // Auto trigger print after fonts load if desired
        window.addEventListener('DOMContentLoaded', () => {
          window.focus();
        });
      </script>
    </body>
    </html>
  `;
}

function renderHeader(page: BookPage, branding: SchoolBranding): string {
  const schoolName = branding.schoolName || 'مدارس ابن سيناء الأهلية';
  const departmentName = branding.departmentName || 'قسم إدارة الجودة والتطوير التعليمي';
  const qrBadgeHtml = renderQRCodeBadge(page, branding);

  return `
    <header class="page-header">
      <div class="header-top-row">
        
        <!-- Right: School Branding (Compact) -->
        <div class="school-branding-group">
          ${branding.showLogoInPrint ? (
            branding.logoUrl 
              ? `<img src="${branding.logoUrl}" class="school-logo-img" alt="شعار المدرسة" />`
              : `<div class="school-logo-vector">
                  <svg viewBox="0 0 100 100" class="school-logo-vector">
                    <circle cx="50" cy="50" r="46" fill="#064E3B" stroke="#F59E0B" stroke-width="3" />
                    <circle cx="50" cy="50" r="38" fill="#047857" />
                    <path d="M50 56 C 42 52, 28 54, 22 60 L 22 40 C 28 35, 42 34, 50 38 Z" fill="#FEF3C7" stroke="#D97706" stroke-width="1.2"/>
                    <path d="M50 56 C 58 52, 72 54, 78 60 L 78 40 C 72 35, 58 34, 50 38 Z" fill="#FEF3C7" stroke="#D97706" stroke-width="1.2"/>
                    <path d="M50 38 L50 62" stroke="#92400E" stroke-width="1.5" />
                    <circle cx="50" cy="22" r="3" fill="#EF4444" />
                  </svg>
                </div>`
          ) : ''}
          <div class="school-titles">
            <h1 class="text-school-name">${schoolName}</h1>
            <p class="text-dept-name">${departmentName}</p>
          </div>
        </div>

        <!-- Center: Unit Badge & Main Lesson Title -->
        <div class="header-center-title">
          <span class="unit-badge">${page.unitTitle}</span>
          <div class="page-main-title">${page.title}</div>
        </div>

        <!-- Left: QR Code & Crisp Page Badge -->
        <div style="text-align: left; display: flex; align-items: center; gap: 8px;">
          ${qrBadgeHtml}
          <div>
            <div class="page-num-badge">${page.pageNumber}</div>
            <div class="page-num-sub">ص ${page.pageNumber} من ١٢١</div>
          </div>
        </div>
      </div>
    </header>
  `;
}

function renderFooter(page: BookPage, branding: SchoolBranding): string {
  const schoolName = branding.schoolName || 'مدارس ابن سيناء الأهلية';

  return `
    <footer class="page-footer">
      ${branding.showEvaluationBoxInPrint !== false ? `
        <div class="mastery-indicator-box">
          <div class="mastery-indicator-top">
            <div class="mastery-title-wrap">
              <span class="mastery-title-icon">🎯</span>
              <strong class="mastery-title-text">مؤشرات إتقان التلميذ (نظام المحاولات الأربع):</strong>
            </div>
            <div class="mastery-attempts-row">
              <span class="attempt-check-pill"><span class="check-sq">[ &nbsp; ]</span> المحاولة الأولى ⭐⭐⭐</span>
              <span class="attempt-check-pill"><span class="check-sq">[ &nbsp; ]</span> المحاولة الثانية ⭐⭐</span>
              <span class="attempt-check-pill"><span class="check-sq">[ &nbsp; ]</span> المحاولة الثالثة ⭐</span>
              <span class="attempt-check-pill"><span class="check-sq">[ &nbsp; ]</span> المحاولة الرابعة (علاجي)</span>
            </div>
          </div>

          <div class="mastery-indicator-meta">
            <div class="meta-sign-item">
              <strong>توقيع المعلم/ة: </strong>
              <span class="sign-line">.......................................</span>
            </div>
            <div class="meta-sign-item">
              <strong>تاريخ الإتقان: </strong>
              <span class="date-line">.... / .... / ١٤٤هـ</span>
            </div>
            <div class="meta-sign-item">
              <strong>توقيع ولي الأمر: </strong>
              <span class="sign-line">.......................................</span>
            </div>
          </div>
        </div>
      ` : ''}

      <div class="footer-bottom-row">
        <span>${schoolName}</span>
        <span>الخطة العلاجية لمهارات القراءة والكتابة (١٢١ صفحة علاجية)</span>
        <span>صفحة ${page.pageNumber} من ١٢١</span>
      </div>
    </footer>
  `;
}

/**
 * Execute print via isolated hidden iframe (works 100% reliably in sandboxed iframe previews)
 */
export function printViaIsolatedIframe(htmlContent: string): Promise<boolean> {
  return new Promise((resolve) => {
    try {
      const iframe = document.createElement('iframe');
      iframe.style.position = 'fixed';
      iframe.style.right = '0';
      iframe.style.bottom = '0';
      iframe.style.width = '0';
      iframe.style.height = '0';
      iframe.style.border = '0';
      iframe.style.zIndex = '-9999';
      document.body.appendChild(iframe);

      const doc = iframe.contentWindow?.document;
      if (!doc) {
        throw new Error('Iframe document not accessible');
      }

      doc.open();
      doc.write(htmlContent);
      doc.close();

      setTimeout(() => {
        try {
          iframe.contentWindow?.focus();
          iframe.contentWindow?.print();
          resolve(true);
        } catch (err) {
          console.warn('Iframe print failed, falling back to window.open', err);
          resolve(false);
        } finally {
          setTimeout(() => {
            if (iframe.parentNode) {
              iframe.parentNode.removeChild(iframe);
            }
          }, 60000);
        }
      }, 500);
    } catch (e) {
      console.error('Print iframe creation error:', e);
      resolve(false);
    }
  });
}

/**
 * Open print document in a clean new browser tab / window
 */
export function openPrintInNewWindow(htmlContent: string): boolean {
  try {
    const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const win = window.open(url, '_blank');
    if (win) {
      win.focus();
      return true;
    }
  } catch (e) {
    console.error('Failed to open print window:', e);
  }
  return false;
}

/**
 * Download standalone printable HTML file
 */
export function downloadPrintableFile(htmlContent: string, filename = 'الخطة_العلاجية_مطبوعات.html'): void {
  try {
    const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    setTimeout(() => {
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }, 1000);
  } catch (e) {
    console.error('Download printable failed:', e);
  }
}
