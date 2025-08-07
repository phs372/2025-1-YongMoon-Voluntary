let posts = [];

  // UI 요소
  const settingsBtn = document.getElementById('settingsBtn');
  const settingsPanel = document.getElementById('settingsPanel');
  const darkModeToggle = document.getElementById('darkModeToggle');
  const fontSizeSelect = document.getElementById('fontSizeSelect');

  const writeBtn = document.getElementById('writeBtn');
  const editorPanel = document.getElementById('editorPanel');
  const savePostBtn = document.getElementById('savePostBtn');
  const cancelPostBtn = document.getElementById('cancelPostBtn');

  const postTitleInput = document.getElementById('postTitle');
  const postContentInput = document.getElementById('postContent');
  const postImageInput = document.getElementById('postImage');
  const fontSelect = document.getElementById('fontSelect');
  const colorPicker = document.getElementById('colorPicker');

  const postsList = document.getElementById('postsList');

  const postDetail = document.getElementById('postDetail');
  const detailTitle = document.getElementById('detailTitle');
  const detailImage = document.getElementById('detailImage');
  const detailContent = document.getElementById('detailContent');
  const backToListBtn = document.getElementById('backToListBtn');

  // 설정 버튼 토글
  settingsBtn.addEventListener('click', () => {
    if (settingsPanel.style.display === 'block') {
      settingsPanel.style.display = 'none';
    } else {
      settingsPanel.style.display = 'block';
    }
  });

  // 다크모드 토글
  darkModeToggle.addEventListener('change', () => {
    if (darkModeToggle.checked) {
      document.body.classList.add('dark');
    } else {
      document.body.classList.remove('dark');
    }
  });

  // 글씨 크기 변경
  fontSizeSelect.addEventListener('change', () => {
    document.body.style.fontSize = fontSizeSelect.value;
  });

  // 글쓰기 버튼 클릭 -> 편집창 보이기
  writeBtn.addEventListener('click', () => {
    editorPanel.style.display = 'flex';
    // 설정창 닫기
    settingsPanel.style.display = 'none';
    // 입력 초기화
    postTitleInput.value = '';
    postContentInput.value = '';
    postImageInput.value = '';
    fontSelect.value = 'Arial';
    colorPicker.value = '#000000';
  });

  // 편집 취소 버튼
  cancelPostBtn.addEventListener('click', () => {
    editorPanel.style.display = 'none';
  });

  // 게시글 저장
  savePostBtn.addEventListener('click', () => {
    const title = postTitleInput.value.trim();
    const content = postContentInput.value.trim();
    if (!title || !content) {
      alert('제목과 내용을 모두 입력해주세요.');
      return;
    }

    // 이미지 파일이 있으면 base64로 변환
    if (postImageInput.files && postImageInput.files[0]) {
      const reader = new FileReader();
      reader.onload = function(e) {
        addPost(title, content, e.target.result);
      };
      reader.readAsDataURL(postImageInput.files[0]);
    } else {
      addPost(title, content, null);
    }
  });

  // 게시글 추가 및 리스트 갱신
  function addPost(title, content, imageSrc) {
    const newPost = {
      id: Date.now(),
      title,
      content,
      imageSrc,
      fontFamily: fontSelect.value,
      color: colorPicker.value
    };
    posts.unshift(newPost); // 최신 글이 위로
    renderPosts();
    editorPanel.style.display = 'none';
  }

  // 게시글 목록 렌더링
  function renderPosts() {
    postsList.innerHTML = '';
    if(posts.length === 0) {
      postsList.innerHTML = '<p>게시글이 없습니다.</p>';
      return;
    }
    posts.forEach(post => {
      const postCard = document.createElement('div');
      postCard.className = 'postCard';
      postCard.style.fontFamily = post.fontFamily;
      postCard.style.color = post.color;

      const titleEl = document.createElement('div');
      titleEl.className = 'postTitle';
      titleEl.textContent = post.title;

      postCard.appendChild(titleEl);

      if(post.imageSrc) {
        const imgEl = document.createElement('img');
        imgEl.src = post.imageSrc;
        imgEl.alt = '첨부 이미지';
        imgEl.className = 'postImage';
        postCard.appendChild(imgEl);
      }

      const excerpt = post.content.length > 100 ? post.content.slice(0,100) + '...' : post.content;
      const excerptEl = document.createElement('div');
      excerptEl.className = 'postExcerpt';
      excerptEl.textContent = excerpt;

      postCard.appendChild(excerptEl);

      // 게시글 클릭시 상세보기
      postCard.addEventListener('click', () => {
        showPostDetail(post.id);
      });

      postsList.appendChild(postCard);
    });
  }

  // 게시글 상세보기 표시
  function showPostDetail(id) {
    const post = posts.find(p => p.id === id);
    if(!post) return;

    detailTitle.textContent = post.title;
    detailContent.textContent = post.content;
    detailImage.style.display = post.imageSrc ? 'block' : 'none';
    detailImage.src = post.imageSrc || '';

    // 글꼴, 색상 반영
    postDetail.style.fontFamily = post.fontFamily;
    postDetail.style.color = post.color;

    // 리스트 숨기고 상세보여줌
    postsList.parentElement.style.display = 'none'; // 게시글 섹션 숨기기
    postDetail.style.display = 'block';

    // 편집창 숨기기
    editorPanel.style.display = 'none';
    settingsPanel.style.display = 'none';
  }

  // 상세보기에서 뒤로가기 버튼
  backToListBtn.addEventListener('click', () => {
    postDetail.style.display = 'none';
    postsList.parentElement.style.display = 'block';
  });
  const deletePostBtn = document.getElementById('deletePostBtn');

let currentViewingPostId = null; // 현재 상세보기 중인 글 ID 저장

// 상세보기 표시 함수 수정 - post.id 저장
function showPostDetail(id) {
  const post = posts.find(p => p.id === id);
  if(!post) return;

  currentViewingPostId = id; // 여기서 ID 저장

  detailTitle.textContent = post.title;
  detailContent.textContent = post.content;
  detailImage.style.display = post.imageSrc ? 'block' : 'none';
  detailImage.src = post.imageSrc || '';

  postDetail.style.fontFamily = post.fontFamily;
  postDetail.style.color = post.color;

  postsList.parentElement.style.display = 'none';
  postDetail.style.display = 'block';

  editorPanel.style.display = 'none';
  settingsPanel.style.display = 'none';
}

// 삭제 버튼 클릭 시
deletePostBtn.addEventListener('click', () => {
  if(currentViewingPostId === null) return;

  if(confirm('정말 이 게시글을 삭제하시겠습니까?')) {
    posts = posts.filter(p => p.id !== currentViewingPostId);
    currentViewingPostId = null;

    // 상세보기 닫고 목록 재표시
    postDetail.style.display = 'none';
    postsList.parentElement.style.display = 'block';
    renderPosts();
  }
});

  // 초기 글씨 크기 세팅
  document.body.style.fontSize = fontSizeSelect.value;

  // 초기 렌더링
  renderPosts();
