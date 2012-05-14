require 'pinyin'
py=PinYin.instance
k=0 
File.open('users.txt').each_line do |line|
  k = k+1
  ss=line.chomp.split("\t")
  uname=py.to_pinyin_b(ss[2])
  dwjc=py.to_pinyin_b(ss[0])[0..1]
  puts "insert into users(email, encrypted_password, username, uname, dw, bm, bgdh, qxcode, hide, dwjc) values ('user#{k}@189.cn','$2a$10$k//FuwX2eWaDwuwFbUZ0DeGLWOYDnfPyVm9xQ91iT6LuwqIfkRo7W','#{ss[2]}','#{uname}','#{ss[0]}','#{ss[1]}','#{ss[3]}','管理员','0','#{dwjc}');"
end  