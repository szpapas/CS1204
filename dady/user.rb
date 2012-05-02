k = 0;
File.open('rymd').each do |line|
  k = k+1;
  ss = line.chomp!.split(/\t/)
  puts "insert into users (email, encrypted_password, username, bm, bgdh) values ('user#{k}@189.cn', 'FuwX2eWaDwuwFbUZ0DeGLWOYDnfPyVm9xQ91iT6LuwqIfkRo7W', '#{ss[1]}', '#{ss[0]}','#{ss[2]}');"
end  