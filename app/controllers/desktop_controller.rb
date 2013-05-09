# encoding: utf-8
require 'socket'
require 'find'
require 'date'
require 'uri'


class DesktopController < ApplicationController
  skip_before_filter :verify_authenticity_token
  before_filter :authenticate_user!, :except => []
  before_filter :set_current_user
  
  def index
  end
  
  def week_dates( week_num )
      year = Time.now.year
      week_start = Date.commercial( year, week_num, 1 )
      week_end = Date.commercial( year, week_num, 7 )
      week_start.strftime( "%m/%d/%y" ) + ' - ' + week_end.strftime( "%m/%d/%y" )
  end
  
  #add at 06/17 
  def get_user_bm
    bm=params['bm']
    mc=params['mc']
    
    sql_str = 'select id, username, bm from users'
    if mc.length > 0 
      sql_str = "#{sql_str} where (username like '#{mc}%' or uname like '#{mc}%') "
    end
    
    if bm.length > 0 && bm != '全部'
      if !sql_str.include?('where')
        sql_str = "#{sql_str} where dw = '#{bm}'" 
      else
        sql_str = "#{sql_str} and dw = '#{bm}'"
      end    
    end
    
    user = User.find_by_sql("#{sql_str} order by username;")
    size = user.size;
    if size.to_i > 0
        txt = "{results:#{size},rows:["
        for k in 0..size-1
            txt = txt + user[k].to_json + ','
        end
        txt = txt[0..-2] + "]}"
    else
        txt = "{results:0,rows:[]}"
    end
    render :text => txt
  end
  
  def get_xmdk
    search=params['search']
    
    sql_str = 'select gid, xh, sfjs, the_center, xzqmc from xmdk'
    if search.length > 0 && search != '全部'
      sql_str = "#{sql_str} where xzqmc like '#{search}%'"
    end
    
    user = User.find_by_sql("#{sql_str} order by gid;")
    size = user.size;
    if size.to_i > 0
        txt = "{results:#{size},rows:["
        for k in 0..size-1
            txt = txt + user[k].to_json + ','
        end
        txt = txt[0..-2] + "]}"
    else
        txt = "{results:0,rows:[]}"
    end
    render :text => txt
  end
  
  def get_xzq_center
    xcqy = params['xcqy']
    xcqy = xcqy.split('(')[0]
    user = User.find_by_sql("select the_center from zjzj where xzqmc='#{xcqy}';")
    txt = ''
    if user.size > 0
      txt = user[0].the_center
    end
    render :text => txt  
  end
  
  def add_plan
    id = params['id']
    qrq, zrq = params['qrq'], params['zrq']
    session_id=Time.now.to_i.to_s
    if id.nil? || id == ''
    else
      User.find_by_sql("update plans set xcqy= '#{params['xcqy']}', xclx = '#{params['xclx']}', xcry='#{params['xcry']}', xcfs='#{params['xcfs']}', xcnr='#{params['xcnr']}', xmdk='#{params['xmdk']}', qrq=TIMESTAMP '#{qrq}', zrq=TIMESTAMP '#{zrq}', xcjg= '#{params['xcjg']}', clyj='#{params['clyj']}' where id = #{params['id']};")
    end
    
    render :text => 'Success'
  end
  
  def delete_selected_plan
    if params['id'] == 'all'
      User.find_by_sql("delete from plans where zt='计划';")
    else  
      #User.find_by_sql("delete from plans where id in (#{params['id']});")
      #User.find_by_sql("delete from inspects where plan_id in (#{params['id']});") 
      User.find_by_sql("update plans set del_tag = '是' where id in (#{params['id']});")
    end
    render :text => 'Success'
  end  
  
  def delete_all_plan
    User.find_by_sql("delete from plans;")
    User.find_by_sql("delete from inspects;") 
    render :text => 'Success'
  end
  
  def get_plan
    params['start'] = params['start'] || "0"
    params['limit'] = params['limit'] || "25"
    params['xcqy']  = params['xcqy'] || "全部"
    params['xcfs']  = params['xcfs'] || "全部"
    params['zt']    = params['zt'] || "全部"
    params['zt2']    = params['zt2'] || "全部"
    params['filter'] = params['filter'] || "全部"
    params['xcry'] =  params['xcry'] || "全部" 
    params['year'] =  params['year'] || "全部" 
    params['username'] = params['username'] || "全部"
    params['del_tag'] = params['del_tag'] || "全部"
    
    cond, conds = [], ''
    cond << "zt='#{params['zt']}'" if params['zt'] != '全部'
    cond << "zt2='#{params['zt2']}'" if params['zt2'] != '全部'
    cond << "xcqy='#{params['xcqy']}'" if params['xcqy'] != '全部'
    cond << "xcfs='#{params['xcfs']}'" if params['xcfs'] != '全部'
    cond << "username='#{params['xcry']}'" if params['xcry'] != '全部'
    cond << "EXTRACT( YEAR from zrq) = '#{params['year']}'" if params['year'] != '全部'
    
    if params['del_tag'] != '全部'
      cond << "del_tag = '是'"
    else 
      cond << "(del_tag is null or del_tag <> '是')"   
    end
    
    conds = cond.size==1 ? "where #{cond[0]}" : "where #{cond.join(' and ')}"  if cond.size > 0
    
    user = User.find_by_sql("select count(*) from plans #{conds} ;")[0]
    size = user.count.to_i;
    if size > 0
      txt = "{results:#{size},rows:["
      puts "select *, (taskbegintime || ' - ' || taskendtime) as xcrq from plans #{conds} limit #{params['limit']} offset #{params['start']};"
      user = User.find_by_sql("select *,  (taskbegintime || ' - ' || taskendtime) as xcrq, st_asgeojson(the_lines)  as geom_string, box2d(the_lines) as boundary from plans #{conds} order by id limit #{params['limit']} offset #{params['start']}  ;")
      for k in 0..user.size-1
        txt = txt + user[k].to_json + ','
      end
      txt = txt[0..-2] + "]}"
    else
      txt = "{results:0,rows:[]}"
    end
    render :text => txt.gsub(" 00:00:00","")
  end
  
  def get_user
    render :text => User.current.to_json
  end
  
  def print_selected_plan
    user = User.find_by_sql("select * from plans where id in (#{params['id']});")
    for k in 0..user.size-1
      puts "ruby ./dady/bin/print_plan.rb #{user[k].id}"
      system("ruby ./dady/bin/print_plan.rb #{user[k].id}")
    end
    render :text => "/images/dady/images/#{user[0].xcbh}-01.png"
  end
  
  def get_ygtree
    text = []
    node = params["node"].chomp
    if node == "root"
      if !params['filter'].nil?
        data = User.find_by_sql("select distinct dw from users where username like  '%#{params['filter']}%' or  uname like  '%#{params['filter']}%' ;")
      else
        data = User.find_by_sql("select distinct dw from users;")
      end
      
      data.each do |dd|
        text << {:text => dd["dw"], :id => dd["dw"], :cls  => "folder"}
      end
    else
      pars = node.split('|') || []
  
      if pars.length == 1
        if pars[0]=='常熟市局'
            if !params['filter'].nil?
              data = User.find_by_sql("select distinct bm from users where dw='#{pars[0]}' and (username like '%#{params['filter']}%' or uname like  '%#{params['filter']}%') ;")
            else
              data = User.find_by_sql("select distinct bm from users where dw='#{pars[0]}';")
            end
            data.each do |dd|
            text << {:text => dd["bm"], :id => pars[0]+"|#{dd["bm"]}", :iconCls => "folder"}
          end     
        else 
          if !params['filter'].nil?
            data = User.find_by_sql("select distinct username, bgdh, iphone, uname from users where dw='#{pars[0]}' and (username like  '%#{params['filter']}%' or  uname like  '%#{params['filter']}%') order by uname;")
          else
            data = User.find_by_sql("select distinct username, bgdh, iphone, uname from users where dw='#{pars[0]}' order by uname;")
          end
          data.each do |dd|
          text << {:text => dd["username"], :id => pars[0]+"|#{dd["username"]}|#{dd['bgdh']}", :iconCls => "user",  :leaf => true}
        end     
        end
      end
      
      if pars.length == 2
          if !params['filter'].nil?
            data = User.find_by_sql("select distinct username, bgdh, iphone, uname from users where dw='#{pars[0]}' and bm='#{pars[1]}' and (username like  '%#{params['filter']}%' or  uname like  '%#{params['filter']}%') order by uname ;")
          else
            data = User.find_by_sql("select distinct username, bgdh, iphone, uname from users where dw='#{pars[0]}' and bm='#{pars[1]}' order by uname;")
          end
          data.each do |dd|
          text << {:text => dd["username"], :id => pars[0]+"|#{dd["username"]}|#{dd['bgdh']}", :iconCls => "user",  :leaf => true}
        end     
      end
    end
    render :text => text.to_json
  end
  
  def get_detail_user
    user = User.find_by_sql("select * from users where username='#{params['name']}';");
    render :text => user[0].to_json
  end
  
  #add at 04/29
  def get_xcry_json
    xcqy = params['xcqy']
    if xcqy=='常熟市局'
      user = User.find_by_sql("select username from users where bm='国土资源监察大队';")
    else
      user = User.find_by_sql("select username from users where dw='#{xcqy}' and iphone is not null;")
    end
    size = user.count.to_i;
    if size > 0
      txt = "{results:#{size+1},rows:[{\"username\":\"\\u5168\\u90e8\"},"
      for k in 0..user.size-1
        txt = txt + user[k].to_json + ','
      end
      txt = txt[0..-2] + "]}"
    else
      txt = "{results:0,rows:[]}"
    end
    render :text => txt
  end
    
  def get_xcry(xcqy)
    if xcqy=='常熟市局'
      user = User.find_by_sql("select username from users where bm='国土资源监察大队' limit 10;")
    else
      user = User.find_by_sql("select username from users where dw='#{xcqy}' limit 10;")
    end
    txt = ''
    for k in 0..user.count-1
      txt=txt + ','+user[k].username
    end
    txt = txt[1..-1] if txt.size > 0
  end

  def get_xzq_xcry
    txt = get_xcry(params['xcqy'])
    render :text => txt
  end 
  
  def get_week_day
    year, week_num = params['nd'].to_i, params['week'].to_i
    week_start = Date.commercial(year, week_num, 1 )
    week_end = Date.commercial(year, week_num, 7 )
    txt = week_start.strftime( "%Y-%m-%d" ) + '|' + week_end.strftime( "%Y-%m-%d" )
    puts txt
    render :text => txt
  end

  def add_zhxc_twice_per_phone(iphone, nd, yd)  
    data = User.find_by_sql("select distinct dw, dwjc, username, uname from users where iphone='#{iphone}';")
    xcry = data[0]['username']
    xcqy = data[0]['dw']
    
    if (yd != '全部')
      nd, yd = nd.to_i, yd.to_i
      t1 = Time.local(nd,yd,1)
      if yd.to_i < 12
        t2 = Time.local(nd,yd+1,1)-86400 
      else
        t2 = Time.local(nd,12,31)
      end
      w_begin = t1.strftime('%W').to_i + 1
      w_end   = t2.strftime('%W').to_i + 1
      w_end = 52 if w_end > 52  
    else
      w_begin, w_end = 1, 52
    end

    username = data[0].username
    device = iphone
    
    for week in w_begin..w_end
      week_start = Date.commercial(nd, week, 1)
      week_end   = Date.commercial(nd, week, 7 )
      xcbh = "xc-#{data[0].uname}-#{data[0].dwjc}-w#{week.to_s.rjust(2,'0')}-01"
      rwmc = "#{data[0].username} #{nd}年#{week}周 第1次巡查"
      session_id =rand(36**32).to_s(36)
      qrq = week_start.strftime( "%Y-%m-%d" ) 
      zrq = week_end.strftime( "%Y-%m-%d" )
      User.find_by_sql("delete from plans where rwmc = '#{rwmc}' and zt = '计划';")
      plan_count = User.find_by_sql("select count(*) from plans where rwmc = '#{rwmc}';")
      
      if plan_count[0]['count'].to_i == 0 
        User.find_by_sql "insert into plans (xcbh, rwmc, session_id, zt, qrq, zrq, xcqy, xcfs, xcry, device, username) values ('#{xcbh}', '#{rwmc}','#{session_id}', '计划',  TIMESTAMP '#{qrq}',  TIMESTAMP '#{zrq}', '#{xcqy}', '综合巡查', '#{xcry}', '#{device}', '#{username}')" 
      end
      
      xcbh = "xc-#{data[0].uname}-#{data[0].dwjc}-w#{week.to_s.rjust(2,'0')}-02"
      rwmc = "#{data[0].username} #{nd}年#{week}周 第2次巡查"
      session_id =rand(36**32).to_s(36)
      qrq = week_start.strftime( "%Y-%m-%d" ) 
      zrq = week_end.strftime( "%Y-%m-%d" )
      User.find_by_sql("delete from plans where rwmc = '#{rwmc}' and zt = '计划';")
      plan_count = User.find_by_sql("select count(*) from plans where rwmc = '#{rwmc}';")
      
      if plan_count[0]['count'].to_i == 0 
        User.find_by_sql "insert into plans (xcbh, rwmc, session_id, zt, qrq, zrq, xcqy, xcfs, xcry, device, username) values ('#{xcbh}', '#{rwmc}','#{session_id}', '计划',  TIMESTAMP '#{qrq}',  TIMESTAMP '#{zrq}', '#{xcqy}', '综合巡查', '#{xcry}', '#{device}', '#{username}')" 
      end
        
    end
  end

  def add_zhxc_phone(xqzmc, nd, pd, xcry, yd)
    if xqzmc=='全部'
      user = User.find_by_sql("select distinct iphone from users where iphone !='';")
      for k in 0..user.count-1
        iphone = user[k].iphone
        add_zhxc_twice_per_phone(iphone, nd, yd)
      end  
    else
      if xcry=='全部'  
        user = User.find_by_sql("select distinct iphone from users where iphone !='' and dw = '#{xqzmc}';")
        for k in 0..user.count-1
          iphone = user[k].iphone
          add_zhxc_twice_per_phone(iphone, nd, yd)
        end
      else
        user = User.find_by_sql("select distinct iphone from users where usrname = '#{xcry}'")
        iphone = user[0].iphone
        add_zhxc_twice_per_phone(iphone, nd, yd)
      end    
    end  
  end
  
  def add_ddxc(nd)
    user = User.find_by_sql("select gid, xh, xzqmc from xmdk where nd='#{nd}' order by xh;")
    for k in 0..user.count-1
      data = user[k]
      puts data.to_json, data.xh
      xcbh = "#{data.xh}-#{nd}"
      xcqy = data.xzqmc
      xcry = get_xcry(data.xzqmc)
      session_id =rand(36**32).to_s(36)
      qrq = "#{nd}-01-01" 
      zrq = "#{nd}-12-31"
      User.find_by_sql "insert into plans (xcbh, session_id, zt, qrq, zrq, xcqy, xcfs, xcry, xmdk) values ('#{xcbh}', '#{session_id}', '计划',  TIMESTAMP '#{qrq}',  TIMESTAMP '#{zrq}', '#{xcqy}', '定点巡查', '#{xcry}', '#{data.xh}')"
      cvl = User.find_by_sql "SELECT id from plans where session_id = '#{session_id}'"
      plan_id = cvl[0].id.to_i
      User.find_by_sql "insert into inspects (plan_id, xmdk_id) values (#{plan_id}, #{data.gid});"
      User.find_by_sql "update inspects set username = plans.xcry from plans where inspects.plan_id = #{plan_id};"
      User.find_by_sql "update inspects set iphone = users.iphone from users where inspects.username = users.username and inspects.plan_id = #{plan_id};"
      
      User.find_by_sql "update xmdks set xc_count = (select count(*) from inspects where xmdks.gid = inspects.xmdk_id);"
      
    end 
  end
  
  def add_plan_wiz
    xcfs,xcqy,nd,pd,xcry,yd = params['xcfs'],params['xcqy'],params['nd'].to_i,params['pd'],params['xcry'],params['yd']
    if xcfs=='综合巡查'
      add_zhxc_phone(xcqy, nd, pd, xcry, yd)
    else
      add_ddxc(nd)
    end
      
    render :text => 'Success'
  end

  # get all current_active user postion, 当前Area内的。
  def get_user_position
    
    username = params['username'];
    user = User.find_by_sql("select * from users where username = '#{username}';")[0]
    
    if user.qxcode == '管理员'
      if params['zt'] == "在线"
        cond = " and (now() - interval '12 hour') < last_seen"
      elsif params['zt'] == "不在线"
        cond = " and (now() - interval '12 hour') > last_seen"
      else 
        cond = ''
      end
    else
      if params['zt'] == "在线"
        cond = " and (now() - interval '12 hour') < last_seen and dw = '#{user.dw}' "
      elsif params['zt'] == "不在线"
        cond = " and (now() - interval '12 hour') > last_seen and dw = '#{user.dw}' "
      else 
        cond = " and dw = '#{User.current.dw}' "
      end
    end
    
    puts User.current.qxcode
          
    user = User.find_by_sql("select id, astext(the_points) as lon_lat, username, iphone as device, last_seen as report_at, (now() - interval '12 hour') < last_seen as zt from users where last_seen is not NULL #{cond} and x(the_points) > 100000;")
    
    render :text => user.to_json
  end
  
  #add at 06/08
  def get_task_position
    user = User.find_by_sql("select id, astext(the_lines) as lon_lat, username, device, report_at, session_id from plans where id=#{params['task_id']} order by report_at desc;")

    render :text => user.to_json
  end
  
  def get_multi_taskline
    task_ids  = params['task_id'].split(',').join(',')
    user = User.find_by_sql("select id, astext(the_lines) as lon_lat, username, device, report_at, session_id from plans where id in (#{task_ids}) order by report_at desc;")

    render :text => user.to_json
    
  end  
  
  def get_task_position_over
    user = User.find_by_sql("select id, astext(the_lines) as lon_lat, username, device, report_at, session_id from plans where zt='完成' order by report_at desc;")

    render :text => user.to_json
  end
  
  #====add at 05/04
  def get_phone_list
    zt = params['zt'] || '执行'
    if zt == '执行'
      user = User.find_by_sql("select id, astext(the_points) as lon_lat, username, device, session_id, report_at, zt from plans where zt='执行';")
    else
      user = User.find_by_sql("select id, astext(the_points) as lon_lat, username, iphone as device, last_seen as report_at, (now() + interval '7 hour') < last_seen as zt from users where last_seen is not NULL;")
    end    
    size = user.count.to_i;
    if size > 0
      txt = "{results:#{size},rows:["
      for k in 0..user.size-1
        txt = txt + user[k].to_json + ','
      end
      txt = txt[0..-2] + "]}"
    else
      txt = "{results:0,rows:[]}"
    end
    render :text => txt
  end
  
  def upload_pic2
    
    logger.debug("========filename: #{params['value1']} ")
    
    task_id = params['task_id'].to_i
    session_id = params['session_id']
    inspect_id = params['inspect_id']
    pic_name = params['image_name']+'.jpg'

    params.each do |k,v|
      #logger.debug("#{k} , #{v}")
      if k.include?("image_file")
        logger.debug("#{v.path}")
        yxpath = "./dady/xctp/#{task_id}/#{inspect_id}"
        system("mkdir -p #{yxpath}") if !File.exists?(yxpath)
        system("cp #{v.path} #{yxpath}/#{pic_name}")
        system("chmod 644 #{yxpath}/#{pic_name}")
        logger.debug("./dady/bin/save_image.rb #{yxpath}  #{pic_name} #{params['tpjd']} #{params['tpbz']} #{inspect_id}  #{task_id} ")
        system("ruby ./dady/bin/save_image.rb #{yxpath}  #{pic_name} #{params['tpjd']} #{params['tpbz']} #{inspect_id}  #{task_id} ")
      end
      
    end
    render :text => "Success"
  end
  
  def change_password
    if params['password_confirmation'] == params['password']
      User.current.password = params['password']
      User.current.password_confirmation=params['password']
      User.current.save
      render :text => 'Success'
    else
      render :text => 'Falied'
    end
  end  
  
  #change at 05/13
  def  get_user_grid
    filter = params['filter']
    ss = filter.split('|')
    if ss.size == 1 
       user = User.find_by_sql("select * from  users where dw = '#{ss[0]}' order by id;")
    elsif ss.size == 2
       user = User.find_by_sql("select * from  users where dw = '#{ss[0]}' and bm = '#{ss[1]}' order by id;")
    else 
      user = User.find_by_sql("select * from  users order by id;")
    end
      
    size = user.size;
    if size > 0 
     txt = "{results:#{size},rows:["
     for k in 0..user.size-1
       txt = txt + user[k].to_json + ','
     end
     txt = txt[0..-2] + "]}"
    else
     txt = "{results:0,rows:[]}"  
    end  
    render :text => txt
  end
  
  def add_user
    if !params['id'].nil? && params['id'] != ''  
      User.find_by_sql("update users set qxcode='#{params['qxcode']}', hide='#{params['hide']}', email='#{params['email']}', username='#{params['username']}', bgdh='#{params['bgdh']}', bm='#{params['bm']}', iphone='#{params['iphone']}' where id=#{params['id']}; ")
    else
      User.find_by_sql("insert into users (username, email, qxcode, bm, bgdh, iphone) values('#{params['username']}','#{params['email']}', '#{params['qxcode']}', '#{params['bm']}', '#{params['bgdh']}', '#{params['iphone']}'); ")
    end  
    render :text => 'Success'
  end 
  
  def delete_selected_user
    User.find_by_sql("delete from users where id in (#{params['id']});")
    render :text => 'Success'
  end
  
  def reset_password
    ss=params['id'].split(',')
    for k in 0..ss.size-1
      user = User.find(ss[k].to_i)
      puts user.username
      user.password='123!@#'
      user.password_confirmation='123!@#'
      user.save
    end  
    render :text => 'Success'
  end
  
  
  #新增用户信息
  def insert_user
    #logger.debug  User。id
    user=User.find_by_sql("select * from users where  email='#{params['email']}';")
    size = user.size
    if size == 0
      user = User.new
      user.email=params['email']
      user.password_confirmation=params['encrypted_password']
      user.password = params['encrypted_password']
      user.save
      txt='success'
    else
      txt= '用户名称已经存在，请重新输入用户名称。'
    end
    render :text => txt
  end
  
  #删除用户信息
  def delete_user
    user=User.find_by_sql("delete from users where  id=#{params['id']};")
    render :text => 'success'
  end

  #更新用户信息
  def update_user
   user=User.find_by_sql("select * from users where id <> #{params['id']} and email='#{params['email']}';")
   size = user.size
   if size == 0
     User.find_by_sql("update users set email='#{params['email']}', encrypted_password='#{params['encrypted_password']}' where id = #{params['id']};")
     txt='success'
   else
     txt= '用户名称已经存在，请重新输入用户名称。'
   end
   render :text => txt
  end

  
  #add at 06/06
  def get_yhtree
    text = []
    node = params["node"].chomp
    if node == "root"
      data = User.find_by_sql("select distinct dw from users;")
      data.each do |dd|
        text << {:text => dd["dw"], :id => dd["dw"], :cls  => "folder"}
      end
    else
      pars = node.split('|') || []
  
      if pars.length == 1
        if pars[0]=='常熟市局'
            data = User.find_by_sql("select distinct bm from users where dw='#{pars[0]}';")
            data.each do |dd|
            text << {:text => dd["bm"], :id => pars[0]+"|#{dd["bm"]}", :iconCls => "folder"}
          end     
        else 
          data = User.find_by_sql("select distinct username, bgdh, iphone, uname from users where dw='#{pars[0]}' order by uname;")
          data.each do |dd|
          text << {:text => dd["username"], :id => pars[0]+"|#{dd["username"]}|#{dd['bgdh']}", :iconCls => "user",  :leaf => true}
        end     
        end
      end
      
      if pars.length == 2
          data = User.find_by_sql("select distinct username, bgdh, iphone, uname from users where dw='#{pars[0]}' and bm='#{pars[1]}' order by uname;")
          data.each do |dd|
          text << {:text => dd["username"], :id => pars[0]+"|#{dd["username"]}|#{dd['bgdh']}", :iconCls => "user",  :leaf => true}
        end     
      end
    end
    render :text => text.to_json
  end
  
  #add on 06/09
  
  def get_bmtree1
    text = []
    node = params["node"].chomp
    if node == "root"
      if !params['filter'].nil?
        data = User.find_by_sql("select distinct dw from users where username like  '%#{params['filter']}%' or  uname like  '%#{params['filter']}%';")
      else
        data = User.find_by_sql("select distinct dw from users where dw IS NOT NULL order by dw;")
      end
      
      data.each do |dd|
        text << {:text => dd["dw"], :id => dd["dw"], :cls  => "folder", :leaf => true}
      end
    end
    render :text => text.to_json 
  end
  
 
  
  #add on 06/12
  def display_selected_plan
    user = User.find_by_sql("select * from plans where id=#{params['id']};")[0]
    rand_file="./public/static/zfjc/zfjc_#{rand(36**32).to_s(36)}.html"
    
    pics = User.find_by_sql("select id, yxmc, rq, tpjd, bz, xmdk_id, plan_id from xcimage where plan_id=#{params['id']};")
    
    image_url = ""
    for pp in 0..pics.size-1
      dd = pics[pp]
      imgPath = "/images/dady/xctp/#{dd['plan_id']}/#{dd['xmdk_id']}/#{dd['yxmc']}"
      image_url = image_url + "<img src=\"#{imgPath}\" width=\"280\" alt=\"\"> &nbsp;&nbsp;"
    end  
   
    ss=File.open('./public/static/zfjc/xcmb.tpl.html').read.gsub("{TAG_XCSJ}","#{user.report_at}").gsub("{TAG_XCLX}","#{user.xclx}").gsub("{TAG_XCRY}","#{user.xcry}").gsub("{TAG_XCFS}","#{user.xcfs}").gsub("{TAG_XCNR}","#{user.xcnr}").gsub("{TAG_XCJG}","#{user.xcjg}").gsub("{TAG_CLYYJG}","#{user.clyj}").gsub("{TAG_IMGS}",image_url).gsub("{XC_DATE}","#{user.taskendtime}").gsub("{SESSION_ID}", user.session_id)
    
    ff = File.open("#{rand_file}",'w+')
    ff.write(ss)
    ff.close
    render :text=>rand_file.gsub("./public/",'/')
  end
  
  
  def view_pdf
     user = User.find_by_sql("select * from plans where id=#{params['id']};")[0]
     puts "./bin/pdf_table.rb #{params['id']}"
     system "./bin/pdf_table.rb #{params['id']}"
     render :text=> "/images/xcjl/xcjl_#{params['id']}.pdf"
  end
  
  def get_report
    params['start'] = params['start'] || "0"
    params['limit'] = params['limit'] || "25"
    params['nd']    = params['nd'] || "全部"
    params['zt']    = params['zt'] || "全部"
    params['filter'] = params['filter'] || "全部"
    
    cond, conds = [], ''
    cond << "zt='#{params['zt']}'" if params['zt'] != '全部'
    cond << "nd='#{params['nd']}'" if params['nd'] != '全部'
    
    if params['filter'] != '全部'
      ff = params['filter'].split('|')
      if ff.size == 2 
        cond << "tbdw='#{ff[0]}'"
        cond << "lb='#{ff[1]}'" 
      else 
        cond << "tbdw='#{ff[0]}'"
      end    
    end
    
    conds = cond.size==1 ? "where #{cond[0]}" : "where #{cond.join(' and ')}"  if cond.size > 0
    
    user = User.find_by_sql("select count(*) from reports #{conds} ;")[0]
    size = user.count.to_i;
    if size > 0
      txt = "{results:#{size},rows:["
      puts "select * from reports #{conds} limit #{params['limit']} offset #{params['start']};"
      user = User.find_by_sql("select * from reports #{conds} limit #{params['limit']} offset #{params['start']};")
      for k in 0..user.size-1
        txt = txt + user[k].to_json + ','
      end
      txt = txt[0..-2] + "]}"
    else
      txt = "{results:0,rows:[]}"
    end
    render :text => txt
  end
  
  #add on 06/11
  def get_rptree
    text = []
    node = params["node"].chomp
    params['lb'] = params['lb'] || "bm"
    
    if params['lb'] == "bm"
      if node == "root"
        data = User.find_by_sql("select distinct tbdw from reports order by tbdw;")
        data.each do |dd|
          text << {:text => dd["tbdw"], :id => dd["tbdw"], :cls  => "folder"}
        end
      else
        #more info
        data = User.find_by_sql("select distinct lb from reports where tbdw = '#{node}' order by lb;")
        data.each do |dd|
          text << {:text => dd["lb"], :id => "#{node}|#{dd["lb"]}", :iconCls => "text",  :leaf => true}
        end
      end
    else  #time
      if node == "root"
        data = User.find_by_sql("select distinct lb from reports order by lb;")
        data.each do |dd|
          text << {:text => dd["lb"], :id => dd["lb"], :cls  => "folder"}
        end
      else
        #more info 
      end  
    end    
    render :text => text.to_json 
  
  end
  
  def delete_selected_report
    if params['id'] == 'all'
      User.find_by_sql("delete from reports where zt='计划';")
    else  
      User.find_by_sql("delete from reports where id in (#{params['id']});")
    end
    render :text => 'Success'
  end
  
  #add at 06/14
  def add_report
    id = params['id']
    if id.nil? || id == ''
      User.find_by_sql("insert into reports (nd, lb, yf, xh, tbdw, tbr, bgnr, zt) values ('#{params['nd']}','#{params['lb']}','#{params['yf']}','#{params['xh']}','#{params['tbdw']}','#{User.current.username}','#{params['bgnr']}','未提交');")
    else  
      User.find_by_sql("update reports set nd='#{params['nd']}',  lb='#{params['lb']}',yf='#{params['yf']}',xh='#{params['xh']}',tbdw='#{params['tbdw']}',bgnr='#{params['bgnr']}' where id = #{params['id']};")
    end
    render :text => 'Success'
  end  
  
  def commit_selected_report
     ts1 = Time.now.strftime('%Y-%m-%d') 
     User.find_by_sql("update reports set zt='已提交', commit_at = TIMESTAMP '#{ts1}'  where id in (#{params['id']});")
     render :text => 'Success'
  end

  #路线回放点
  def get_track_points
	  user = User.find_by_sql("select astext(the_lines) from plans where id=#{params['task_id']};")
	  if user.size > 0
	    txt = user[0].astext[11..-2]
	  else 
	    txt = ''
	  end     
	  render :text => txt
	end
 
  # 部门， 人员， 路线, 
  def get_phone_tree
    text = []
    node = params["node"]
    
    username = params['username'];
    user = User.find_by_sql("select * from users where username = '#{username}';")[0]
   
    ss = node.split('|')
    if user.qxcode == '管理员'
      if node == "root"
        data = User.find_by_sql("select distinct dw from users where dw is not null;")
        data.each do |dd|
          text << {:text => " #{dd['dw']}", :id => "#{dd["dw"]}", :cls => "folder" }
        end
      else
        pars = node.split('|') || []

        if pars.length == 1
          data = User.find_by_sql("select id, astext(the_points) as lon_lat, username, iphone as device, last_seen as report_at, (now() + interval '7 hour') < last_seen as zt from users where last_seen is not NULL and dw = '#{pars[0]}';")
          data.each do |dd|
            if dd['zt'] == 'f'
              text << {:text => " #{dd['username']}", :id => "#{dd["username"]}|#{dd['lon_lat']}", :cls => "folder", :iconCls => "offline", :checked => false}
            else
              text << {:text => " #{dd['username']}", :id => "#{dd["username"]}|#{dd['lon_lat']}", :cls => "folder", :iconCls => "online", :checked => false}
            end    
          end
        elsif pars.length == 2
          data = User.find_by_sql("select id, rwmc as xcmc, zt, astext(the_lines) as the_lines, report_at  from plans where xcry like '%#{pars[0]}%' and the_lines is not null order by report_at;")
          data.each do |dd|
              text << {:text => "#{dd['xcmc']}", :id => "#{dd["id"]}|#{dd["zt"]}|#{dd['report_at']}", :leaf => true, :cls => "file", :checked => false}
          end
        end
      end
    else user.qxcode = '监察员'
      if node == "root"
        data = User.find_by_sql("select distinct dw from users where dw = '#{user.dw}' ;")
        data.each do |dd|
          text << {:text => " #{dd['dw']}", :id => "#{dd["dw"]}", :cls => "folder" }
        end
      else
        pars = node.split('|') || []

        if pars.length == 1
          data = User.find_by_sql("select id, astext(the_points) as lon_lat, username, iphone as device, last_seen as report_at, (now() + interval '7 hour') < last_seen as zt from users where last_seen is not NULL and dw = '#{pars[0]}';")
          data.each do |dd|
            if dd['zt'] == 'f'
              text << {:text => " #{dd['username']}", :id => "#{dd["username"]}|#{dd['lon_lat']}", :cls => "folder", :iconCls => "offline", :checked => false}
            else
              text << {:text => " #{dd['username']}", :id => "#{dd["username"]}|#{dd['lon_lat']}", :cls => "folder", :iconCls => "online", :checked => false}
            end    
          end
        elsif pars.length == 2
          data = User.find_by_sql("select id, rwmc as xcmc, zt, astext(the_lines) as the_lines, report_at  from plans where xcry like '%#{pars[0]}%' and the_lines is not null order by report_at;")
          data.each do |dd|
              text << {:text => "#{dd['xcmc']}", :id => "#{dd["id"]}|#{dd["zt"]}|#{dd['report_at']}", :leaf => true, :cls => "file", :checked => false}
          end
        end
      end
    end
    render :text => text.to_json
  end
  
  def get_dt_report
    tbdw = params['tbdw'] 
    qrq = params['qrq']
    zrq = params['zrq']
    
    where_a = [];
    where_a << "xcqy='#{tbdw}'" if tbdw != '' && tbdw !='全部'
    where_a << "taskbegintime > TIMESTAMP '#{qrq}'" if qrq != ''
    where_a << "taskendtime  < TIMESTAMP '#{zrq}'" if zrq != ''
    
    where_str = where_a.join(" and ")
    if where_a.size > 0
      query_str = "select sum(xclc) as xclc,  sum(xcys) as xcys, sum(xmdk_count) as xmdkc, sum(photo_count) photoc, xcqy from plans where #{where_str} group by xcqy;"
    else
      query_str = "select sum(xclc) as xclc,  sum(xcys) as xcys, sum(xmdk_count) as xmdkc, sum(photo_count) photoc, xcqy from plans group by xcqy;"
    end
      
    user = User.find_by_sql(query_str.gsub('T00:00:00',''))
    size = user.size.to_i;
    if size > 0
      txt = "{results:#{size},rows:["
      for k in 0..user.size-1
        txt = txt + user[k].to_json + ','
      end
      txt = txt[0..-2] + "]}"
    else
      txt = "{results:0,rows:[]}"
    end
    render :text => txt
    
  end
  
  
  
  
  def get_xmdk_list
    user = User.find_by_sql("select gid, xh, pzwh, sfjs, xzqmc, the_center from xmdk where xz_tag is null;")
    size = user.count.to_i;
    if size > 0
      txt = "{results:#{size},rows:["
      for k in 0..user.size-1
        txt = txt + user[k].to_json + ','
      end
      txt = txt[0..-2] + "]}"
    else
      txt = "{results:0,rows:[]}"
    end
    render :text => txt
  end
  
  
  def update_all_xmdk
    user = User.find_by_sql("select gid, xh from xmdk where xz_tag is null;" )
    for k in 0..user.size-1
      xh = user[k]['xh'].center(10)
      convert_str = "convert ./dady/popup_back.png -fill white -pointsize 24 -draw \"text 15, 40 '#{xh}' \" ./public/images/xmdk/popup_#{user[k]['gid']}.png "
      puts convert_str
      system convert_str
    end
    render :text=>'Success'
  end
  
  def view_photos
     user = User.find_by_sql("select * from plans where id=#{params['id']};")[0]
     #render :text=> "http://www.smoothdivscroll.com/demo.html"
     render :text=> "/smooth/easy.html"
  end
  
  def viewphotos
    #@users = User.find_by_sql("select * from photos where id=#{params['id']}")
  end
  
  def getImages
    render :text => '{"images":[{"name":"4216_1_IMAGE_0001.JPG","size":2115,"lastmod":1335292723000,"url":"4216_1_IMAGE_0001.JPG"},
    {"name":"4320_0_IMAGE_0004.JPG","size":2410,"lastmod":1335292723000,"url":"4320_0_IMAGE_0004.JPG"},
    {"name":"4320_0_IMAGE_0005.JPG","size":2120,"lastmod":1335292723000,"url":"4320_0_IMAGE_0005.JPG"},
    {"name":"4320_56_IMAGE_0001.JPG","size":2588,"lastmod":1335292723000,"url":"4320_56_IMAGE_0001.JPG"},
    {"name":"4320_56_IMAGE_0002.JPG","size":2825,"lastmod":1335292723000,"url":"4320_56_IMAGE_0002.JPG"}]}'
  end
  
  # parameter task_id
  def get_xcimage
    user = User.find_by_sql("select * from xcimage where plan_id = #{params['id']};")
    c_txt = '<div id="cars" class="availableLot">'
    for k in 0..user.size-1
      dd = user[k]
      c_txt = c_txt + "<div><img src='/images/dady/xctx/#{dd['yxmc']}' class='imgThumb' qtip='#{dd['bz']}'/></div>"
    end  
    c_txt = c_txt + '</div>'
    
    userpath = "./dady/sc/#{User.current.id}"
    datas = Dir["#{userpath}/*"]
    
    r_txt = '<div id="rented" class="availableLot rented">'
    for k in 0..datas.size-1
      dd = datas[k]
      r_txt = r_txt + "<div><img src='/images/#{dd}' class='imgThumb' qtip='#{dd}'/></div>"
    end  
    r_txt = r_txt + '</div>'
    
    render :text => {"xctx" => c_txt, "kytx" => r_txt, "result" => 'success'}.to_json
  end  
  
  
  def upload_file
    params.each do |k,v|
      logger.debug("K: #{k} ,V: #{v}")
      if k.include?("photo-path")
        logger.debug("#{v.original_filename}")
        logger.debug("#{v.tempfile.path}")
        logger.debug("#{v.content_type}")
        
        userpath = "./dady/sc/#{User.current.id}"
        if !File.exists?(userpath)
          system("mkdir -p #{userpath}")
        end  
        
        ff = File.new("#{userpath}/#{v.original_filename}","w+")
        ff.write(v.tempfile.read)
        ff.close
        break
      end
    end
    render :text => "{success:true}"
  end
  
  #"inspect_id"=>"260", "photo-desc"=>"1212121"
  def upload_xmdks_file
    user = User.find_by_sql("select plan_id, xmdk_id from inspects where id = #{params['inspect_id']};")
    
    if user.size > 0
      
      params.each do |k,v|
        #logger.debug("K: #{k} ,V: #{v}")
        
        if k.include?("photo-path")
          logger.debug("#{v.original_filename}")
          logger.debug("#{v.tempfile.path}")
          logger.debug("#{v.content_type}")

          plan_id = user[0].plan_id
          xmdk_id = user[0].xmdk_id
          timestr = Time.now.strftime('%y%m%d_%H%M%S')
          rq = Time.now.strftime('%Y-%m-%d %T')

          logger.debug "filename:#{v.original_filename}"
          
          
          if v.original_filename.upcase.include?'PNG'
            yxmc = "#{plan_id}_#{xmdk_id}_#{timestr}.PNG"
          elsif v.original_filename.upcase.include?'JPG'
            yxmc = "#{plan_id}_#{xmdk_id}_#{timestr}.JPG"
          end    

          pathname = "./dady/xctx/#{yxmc}"
          puts pathname

          ff = File.new("#{pathname}","w+")
          ff.write(v.tempfile.read)
          ff.close

          system("convert -resize 240x180 #{pathname} #{pathname.gsub(/.jpg|.png/i, '')}-thumb.jpg")
          User.find_by_sql("insert into xcimage (plan_id, xmdk_id, yxmc, rq, bz) values (#{plan_id}, #{xmdk_id}, '#{yxmc}', TIMESTAMP '#{rq}', '#{params['photo-desc']}');")
          User.find_by_sql("update inspects set tpsl = (select count(*) from xcimage where plan_id = #{plan_id}) where id = #{params['inspect_id']}")
          
          break
        end
      end
       
      render :text => "{success:true}"
    else  
      render :text => "{success:false}"
    end

  end
  
  #img = http://127.0.0.1:3000/images/dady/xctx/24632_0_IMAGE_0002.JPG|http://127.0.0.1:3000/images/dady/xctx/24632_0_IMAGE_0003.JPG|
  def delete_selected_photo
    datas = URI.unescape(params['imgs']).split('|')
    for k in 0..datas.size-1 
      url = datas[k]
      if url.include?'xctx'
        img_name = url.split('/')[-1].split('.')[0]
        User.find_by_sql("delete from xcimage where yxmc like '#{img_name}.%';")
        system("rm \"./dady/xctx/#{img_name}.*\"")
      elsif url.include?'sc'          
        userpath = "./dady/sc/#{User.current.id}"
        img_name = url.split('/')[-1]
        system("rm \"#{userpath}/#{img_name}\"")
      end
    end
    
    user = User.find_by_sql("select * from xcimage where plan_id = #{params['id']};")
    c_txt = '<div id="cars" class="availableLot">'
    for k in 0..user.size-1
      dd = user[k]
      c_txt = c_txt + "<div><img src='/images/dady/xctx/#{dd['yxmc'].gsub('PNG','JPG')}' class='imgThumb' qtip='#{dd['bz']}'/></div>"
    end  
    c_txt = c_txt + '</div>'
    
    userpath = "./dady/sc/#{User.current.id}"
    datas = Dir["#{userpath}/*"]
    
    r_txt = '<div id="rented" class="availableLot rented">'
    for k in 0..datas.size-1
      dd = datas[k]
      r_txt = r_txt + "<div><img src='/images/#{dd}' class='imgThumb' qtip='#{dd}'/></div>"
    end  
    
    r_txt = r_txt + '</div>'
    render :text => {"xctx" => c_txt, "kytx" => r_txt, "result" => 'success'}.to_json
    
  end  
  
  
  def save_selected_photo
    datas = URI.unescape(params['imgs']).split('|')
    for k in 0..datas.size-1 
      url = datas[k]
      if url.include?'sc'          
        userpath = "./dady/sc/#{User.current.id}"
        img_name = url.split('/')[-1]
        
        #rename file to #{plan_id}_0_#{time}.jpg
        plan_id = params['id']
        xmdk_id = 0
        timestr = Time.now.strftime('%y%m%d_%H%M%S')
        rq = Time.now.strftime('%Y-%m-%d %T')
        yxmc = "#{plan_id}_#{xmdk_id}_#{timestr}.JPG"
        #geomString = "geomFromText('Point(#{params['lonlat']})',4326)"
        
        User.find_by_sql("insert into xcimage (plan_id, xmdk_id, yxmc, rq) values (#{plan_id}, #{xmdk_id}, '#{yxmc}', TIMESTAMP '#{rq}');")
        pathname = "./dady/xctx/#{yxmc}"
        system("mv #{userpath}/#{img_name} #{pathname}")
        system("convert -resize 240x180 #{pathname} #{pathname.gsub(/.jpg|.png/i, '')}-thumb.jpg")
      end
    end
    
    user = User.find_by_sql("select * from xcimage where plan_id = #{params['id']};")
    c_txt = '<div id="cars" class="availableLot">'
    for k in 0..user.size-1
      dd = user[k]
      c_txt = c_txt + "<div><img src='/images/dady/xctx/#{dd['yxmc'].gsub('PNG','JPG')}' class='imgThumb' qtip='#{dd['bz']}'/></div>"
    end  
    c_txt = c_txt + '</div>'
    
    userpath = "./dady/sc/#{User.current.id}"
    datas = Dir["#{userpath}/*"]
    
    r_txt = '<div id="rented" class="availableLot rented">'
    for k in 0..datas.size-1
      dd = datas[k]
      r_txt = r_txt + "<div><img src='/images/#{dd}' class='imgThumb' qtip='#{dd}'/></div>"
    end  
    r_txt = r_txt + '</div>'
    
    render :text => {"xctx" => c_txt, "kytx" => r_txt, "result" => 'success'}.to_json
  end
  
  def get_khb
    #生成巡查系统考核表,传入参数是６位的年月，如201303
    if params['rq'].nil?
      params['rq']='201303'
    end
    qrq=params['rq'][0,4].to_s + "-" + params['rq'][4,2].to_s + '-01 00:00:00'
    zrq=params['rq'][0,4].to_s + "-" + params['rq'][4,2].to_s + '-' + params['rq'][6,2].to_s + ' 23:59:59'
    xls='<table　border="1" cellpadding="0" bordercolorlight="#999999" bordercolordark="#FFFFFF"　cellspacing="0" align="center"><tr><th style="text-align: center" colspan="10"><font size = 5>执法监察动态巡查系统考核表</font></th></tr>'
    xls=xls + '<tr><th style="text-align: center" colspan="10"><font size = 5>' + params['rq'][0,4].to_s + '年' + params['rq'][4,2].to_s + '月份</font></th></tr>'
    xls=xls + "<tr><td>巡查主体</td><td>单位</td><td>巡查次数</td><td>完成比例(3分)</td><td>上报次数</td><td>上报比例（3分）</td><td>数据质量(2分)</td><td>附件质量（2分）</td><td>成绩指数</td><td>监察员</td></tr>"
    xcqy = User.find_by_sql("select distinct username,xzqmc,bm,px from users where not (bm in ('惠山分局','新区分局','滨湖分局','锡山分局','监察支队','局领导')) order by px")
    if xcqy.size>0
      txt = "{results:#{xcqy.size},rows:["
      for k in 0..xcqy.size-1
        sccs= User.find_by_sql("select count(*) as xccs from plans where  xcry='#{xcqy[k]['username']}' and qrq>='#{qrq}' and qrq<='#{zrq}' and (zt='完成' or zt='执行')")
        sbcs= User.find_by_sql("select count(*) as xccs from plans where  xcry='#{xcqy[k]['username']}' and qrq>='#{qrq}' and qrq<='#{zrq}' and zt='完成' ")
        wcbl=sprintf("%.1f",(sccs[0]['xccs'].to_f/8)*100).to_f
        sbbl=sprintf("%.1f",(sbcs[0]['xccs'].to_f/8)*100).to_f
        fjzl= User.find_by_sql("select count(*) as xccs from plans where  xcry='#{xcqy[k]['username']}' and qrq>='#{qrq}' and qrq<='#{zrq}' and zt='完成' and photo_count>0 ")
        if sbcs[0]['xccs'].to_i>0
          fjzlbl=sprintf("%.1f",(fjzl[0]['xccs'].to_f/sbcs[0]['xccs'].to_f)*100).to_f
        else
          fjzlbl=0
        end
        sjzl= User.find_by_sql("select count(*) as xccs from plans where  xcry='#{xcqy[k]['username']}' and qrq>='#{qrq}' and qrq<='#{zrq}' and zt='完成' and xcnr<>'' and xcjg<>'' and clyj<>'' ")
        if sbcs[0]['xccs'].to_i>0
          sjzlbl=sprintf("%.1f",(sjzl[0]['xccs'].to_f/sbcs[0]['xccs'].to_f)*100).to_f
        else
          sjzlbl=0
        end
        cj=(3*wcbl.to_f+3*sbbl.to_f + 2*sjzlbl.to_f + 2*fjzlbl.to_f)/100
        txt=txt.to_s + "{'xczt':'" + xcqy[k]['xzqmc'].to_s + "_" + xcqy[k]['bm'].to_s + "','xccs':'" + sccs[0]['xccs'].to_s + "','wcbl':'" + wcbl.to_s + "%','sbcs':'" + sbcs[0]['xccs'].to_s + "','sbbl':'" + sbbl.to_s+ "%','sjzl':'"+ sjzlbl.to_s + "%','fjzl':'" + fjzlbl.to_s + "%','cjzs':'" + cj.to_s+ "','jcy':'" + xcqy[k]['username'].to_s + "'},"
        
        xls=xls + "<tr><td>#{xcqy[k]['xzqmc']}</td><td>#{xcqy[k]['bm']}</td><td>#{sccs[0]['xccs']}</td><td>#{wcbl}%</td><td>#{sbcs[0]['xccs']}</td><td>#{sbbl}%</td><td>#{sjzlbl}%</td><td>#{fjzlbl}%</td><td>#{cj}</td><td>#{xcqy[k]['username']}</td></tr>"
      end 
      txt=txt + "]}"     
    else
      txt = "{results:0,rows:[]}"
    end
    xls=xls + "</table>"
    pr_path="./public/images"
    system("rm #{pr_path}/khb.xls")
    ff = File.open(pr_path + "/khb.xls" ,'w+')
    ff.write(xls)
    ff.close
    render :text => txt
  end
    
    
  def get_wfyd
    #生成违法用地统计
    if params['rq'].nil?
      params['rq']='201303'
    end
    if params['xcqymc']=='' || params['xcqymc']=='全部'
      xcqymc=''
    else
      xcqymc=" and users.dw='" + params['xcqymc'] + "'"
    end
    qrq=params['rq'][0,4].to_s + "-" + params['rq'][4,2].to_s + '-01 00:00:00'
    zrq=params['rq'][0,4].to_s + "-" + params['rq'][4,2].to_s + '-' + params['rq'][6,2].to_s + ' 23:59:59'
    xls='<table　border="1" cellpadding="0" bordercolorlight="#999999" bordercolordark="#FFFFFF"　cellspacing="0" align="center">'
    xls=xls + '<tr><th style="text-align: center" colspan="27"><font size = 5>执法监察动态巡查违法用地统计表</font></th></tr>'
    xls=xls + '<tr><th style="text-align: center" colspan="27"><font size = 5>'+ params['rq'][0,4].to_s + '年' + params['rq'][4,2].to_s + '月份</font></th></tr>'
    xls=xls + '<tr><td>巡查主体</td><td>巡查人员</td><td>巡查区域</td><td>巡查任务名称</td><td>巡查时间</td><td>项目名称</td><td>坐落位置</td><td>立项时间</td><td>批文号</td><td>规划定点时间</td><td>规划定点文号</td><td>转征用时间</td><td>转征用批文号</td><td>供地时间</td><td>供地批文号</td><td>批准用途</td><td>实际用途</td><td>批准面积(亩)</td><td>其中耕地(亩)</td><td>动工时间</td><td>建设状况</td><td>实际占地面积(亩)</td><td>其中耕地(亩)</td><td>违法面积</td><td>巡查结果</td><td>处理意见</td><td>备注</td></tr>'
    xcqy = User.find_by_sql("select inspects.bz,plans.rwmc,users.dw,users.bm,inspects.sjzdmj,lxsj,lxpwh,zzysj,zzypwh,inspects.gdmj as sjgdmj,wfmj,inspects.clyj,plans.xcjg,gdsj,gdpwh,pzyt,a_xmdks.sjyt,a_xmdks.dgsj,pzmj,a_xmdks.gdmj,dgsj,inspects.jszt,plans.xcqy,plans.xcry,inspects.xcrq,plans.xcqy,sfwf,jszt,xmdks.xmmc,xmdks.yddw,tdzl,pzwh,gid,ghddsj,ghddh from inspects,plans,xmdks,a_xmdks,users where a_xmdks.gdqkid=xmdks.gdqkid and inspects.plan_id=plans.id and sfwf='是' and xmdk_id=xmdks.gid and users.iphone=plans.device and inspects.xcrq>='#{qrq}' and inspects.xcrq<='#{zrq}' #{xcqymc} order by users.px")
    if xcqy.size>0
      txt = "{results:#{xcqy.size},rows:["
      for k in 0..xcqy.size-1
        xcqy[k]['dgsj']="" if xcqy[k]['dgsj'].nil?
        if xcqy[k]['gdmj'].nil?
          xcqy[k]['gdmj']=""
        else
          xcqy[k]['gdmj']=(xcqy[k]['gdmj'].to_f*0.0015).to_i.to_s
        end 
        if xcqy[k]['pzmj'].nil?
          xcqy[k]['pzmj']=""
        else
          xcqy[k]['pzmj']=(xcqy[k]['pzmj'].to_f*0.0015).to_i.to_s
        end       
        xcqy[k]['sjyt']="" if xcqy[k]['sjyt'].nil?
        xcqy[k]['pzyt']="" if xcqy[k]['pzyt'].nil?
        xcqy[k]['xcjg']="" if xcqy[k]['xcjg'].nil?
        xcqy[k]['clyj']="" if xcqy[k]['clyj'].nil?
        xcqy[k]['wfmj']="" if xcqy[k]['wfmj'].nil?
        xcqy[k]['sjgdmj']="" if xcqy[k]['sjgdmj'].nil?
        xcqy[k]['sjzdmj']="" if xcqy[k]['sjzdmj'].nil?
        xcqy[k]['jszt']="" if xcqy[k]['jszt'].nil?
        xcqy[k]['lxsj']="" if xcqy[k]['lxsj'].nil?
        xcqy[k]['ghddsj']="" if xcqy[k]['ghddsj'].nil?
        xcqy[k]['zzysj']="" if xcqy[k]['zzysj'].nil?
        xcqy[k]['gdsj']="" if xcqy[k]['gdsj'].nil?
               
        xls=xls + "<tr><td>#{xcqy[k]['dw']}</td><td>#{ xcqy[k]['xcry']}</td><td>#{xcqy[k]['bm']}</td><td>#{xcqy[k]['rwmc']}</td><td>#{xcqy[k]['xcrq']}</td><td>#{xcqy[k]['xmmc']}</td><td>#{xcqy[k]['tdzl']}</td><td>#{xcqy[k]['lxsj'][0..9]}</td><td>#{xcqy[k]['lxpwh']}</td><td>#{xcqy[k]['ghddsj'][0..9]}</td><td>#{xcqy[k]['ghddh']}</td><td>#{xcqy[k]['zzysj'][0..9]}</td><td>#{xcqy[k]['zzypwh']}</td><td>#{xcqy[k]['gdsj'][0..9]}</td><td>#{xcqy[k]['gdpwh']}</td><td>#{xcqy[k]['pzyt']}</td><td>#{xcqy[k]['sjyt']}</td><td>#{xcqy[k]['pzmj']}</td><td>#{xcqy[k]['gdmj']}</td><td>#{xcqy[k]['dgsj']}</td><td>#{xcqy[k]['jszt']}</td><td>#{xcqy[k]['sjzdmj']}</td><td>#{xcqy[k]['sjgdmj']}</td><td>#{xcqy[k]['wfmj']}</td><td>#{xcqy[k]['xcjg']}</td><td>#{xcqy[k]['clyj']}</td><td>#{xcqy[k]['bz']}</td></tr>"
        

        txt=txt + "{'xczt':'" + xcqy[k]['xcqy'] + "',"
        txt=txt + "'xcry':'" + xcqy[k]['xcry']  + "',"
        txt=txt + "'clyj':'" + xcqy[k]['clyj'] + "',"
        txt=txt + "'xcjg':'" + xcqy[k]['xcjg'] + "',"
        txt=txt + "'wfmj':'" + xcqy[k]['wfmj'] + "',"
        txt=txt + "'sjgd':'" + xcqy[k]['sjgdmj'] + "',"
        txt=txt + "'sjzd':'" + xcqy[k]['sjzdmj'] + "',"
        txt=txt + "'jsqk':'" + xcqy[k]['jszt'] + "',"
        txt=txt + "'dgsj':'" + xcqy[k]['dgsj'] + "',"
        txt=txt + "'pzgd':'" + xcqy[k]['gdmj'] + "',"
        txt=txt + "'pzmj':'" + xcqy[k]['pzmj'] + "',"
        txt=txt + "'sjyt':'" + xcqy[k]['sjyt'] + "',"
        txt=txt + "'pzyt':'" + xcqy[k]['pzyt'] + "',"
        txt=txt + "'gdpwh':'" + xcqy[k]['gdsj'].to_s + xcqy[k]['gdpwh'].to_s + "',"
        txt=txt + "'zzpwh':'" + xcqy[k]['zzysj'].to_s + xcqy[k]['zzypwh'].to_s + "',"
        txt=txt + "'ghwh':'" + xcqy[k]['ghddsj'].to_s + xcqy[k]['ghddh'].to_s + "',"
        txt=txt + "'lxpwh':'" + xcqy[k]['lxsj'].to_s + xcqy[k]['lxpwh'].to_s + "',"
        txt=txt + "'xmzl':'" + xcqy[k]['tdzl'] + "'"
        txt=txt + ",'xcqy':'" + xcqy[k]['xcqy'] + "',"
        txt=txt + "'xmmc':'" + xcqy[k]['xmmc'] + "',"
        txt=txt + "'xcsj':'#{xcqy[k]['xcrq']}'},"
      end 
      txt=txt + "]}"     
    else
      txt = "{results:0,rows:[]}"
    end
    xls=xls + "</table>"
    pr_path="./public/images"
    system("rm #{pr_path}/wfyd.xls")
    ff = File.open(pr_path + "/wfyd.xls" ,'w+')
    ff.write(xls)
    ff.close
    render :text => txt
  end
  
  #执法监察动态巡查原始记录表
  def get_ysjl
    if params['rq'].nil?
      params['rq']='201303'
    end
    if params['xcqymc']=='' || params['xcqymc']=='全部'
      xcqymc=''
    else
      xcqymc=" and users.dw='" + params['xcqymc'] + "'"
    end
    qrq=params['rq'][0,4].to_s + "-" + params['rq'][4,2].to_s + '-01 00:00:00'
    zrq=params['rq'][0,4].to_s + "-" + params['rq'][4,2].to_s + '-' + params['rq'][6,2].to_s + ' 23:59:59'
    xls='<table　border="1" cellpadding="0" bordercolorlight="#999999" bordercolordark="#FFFFFF"　cellspacing="0" align="center">'
    xls=xls + '<tr><th style="text-align: center" colspan="27"><font size = 5>执法监察动态巡查原始记录表</font></th></tr>'
    xls=xls + '<tr><th style="text-align: center" colspan="27"><font size = 5>'+ params['rq'][0,4].to_s + '年' + params['rq'][4,2].to_s + '月份</font></th></tr>'
    xls=xls + '<tr><td>巡查主体</td><td>巡查人员</td><td>巡查区域</td><td>巡查任务名称</td><td>巡查时间</td><td>项目名称</td><td>坐落位置</td><td>立项时间</td><td>批文号</td><td>规划定点时间</td><td>规划定点文号</td><td>转征用时间</td><td>转征用批文号</td><td>供地时间</td><td>供地批文号</td><td>批准用途</td><td>实际用途</td><td>批准面积(亩)</td><td>其中耕地(亩)</td><td>动工时间</td><td>建设状况</td><td>实际占地面积(亩)</td><td>其中耕地(亩)</td><td>违法面积</td><td>巡查结果</td><td>处理意见</td><td>备注</td></tr>'
    xcqy = User.find_by_sql("select inspects.bz,plans.rwmc,users.dw,users.bm,inspects.sjzdmj,lxsj,lxpwh,zzysj,zzypwh,inspects.gdmj as sjgdmj,wfmj,inspects.clyj,plans.xcjg,gdsj,gdpwh,pzyt,a_xmdks.sjyt,a_xmdks.dgsj,pzmj,a_xmdks.gdmj,dgsj,inspects.jszt,plans.xcqy,plans.xcry,inspects.xcrq,plans.xcqy,sfwf,jszt,xmdks.xmmc,xmdks.yddw,tdzl,pzwh,gid,ghddsj,ghddh,a_xmdks.ydl,a_xmdks.sffhztgh from inspects,plans,xmdks,a_xmdks,users where a_xmdks.gdqkid=xmdks.gdqkid and inspects.plan_id=plans.id  and xmdk_id=xmdks.gid and users.iphone=plans.device  and xcrq>='#{qrq}' and xcrq<='#{zrq}' #{xcqymc} order by users.px,xcry,xcrq")
    if xcqy.size>0
      txt = "{results:#{xcqy.size},rows:["
      for k in 0..xcqy.size-1
        xcqy[k]['dgsj']="" if xcqy[k]['dgsj'].nil?
        if xcqy[k]['gdmj'].nil?
          xcqy[k]['gdmj']=""
        else
          xcqy[k]['gdmj']=(xcqy[k]['gdmj'].to_f*0.0015).to_i.to_s
        end 
        if xcqy[k]['pzmj'].nil?
          xcqy[k]['pzmj']=""
        else
          xcqy[k]['pzmj']=(xcqy[k]['pzmj'].to_f*0.0015).to_i.to_s
        end       
        xcqy[k]['sjyt']="" if xcqy[k]['sjyt'].nil?
        xcqy[k]['pzyt']="" if xcqy[k]['pzyt'].nil?
        xcqy[k]['xcjg']="" if xcqy[k]['xcjg'].nil?
        xcqy[k]['clyj']="" if xcqy[k]['clyj'].nil?
        xcqy[k]['wfmj']="" if xcqy[k]['wfmj'].nil?
        xcqy[k]['sjgdmj']="" if xcqy[k]['sjgdmj'].nil?
        xcqy[k]['sjzdmj']="" if xcqy[k]['sjzdmj'].nil?
        xcqy[k]['jszt']="" if xcqy[k]['jszt'].nil?
        xcqy[k]['lxsj']="" if xcqy[k]['lxsj'].nil?
        xcqy[k]['ghddsj']="" if xcqy[k]['ghddsj'].nil?
        xcqy[k]['zzysj']="" if xcqy[k]['zzysj'].nil?
        xcqy[k]['gdsj']="" if xcqy[k]['gdsj'].nil?
        xcqy[k]['ydl']="" if xcqy[k]['ydl'].nil?
        xcqy[k]['sffhztgh']="" if xcqy[k]['sffhztgh'].nil?
               
        xls=xls + "<tr><td>#{xcqy[k]['dw']}</td><td>#{ xcqy[k]['xcry']}</td><td>#{xcqy[k]['bm']}</td><td>#{xcqy[k]['rwmc']}</td><td>#{xcqy[k]['xcrq']}</td><td>#{xcqy[k]['xmmc']}</td><td>#{xcqy[k]['tdzl']}</td><td>#{xcqy[k]['lxsj'][0..9]}</td><td>#{xcqy[k]['lxpwh']}</td><td>#{xcqy[k]['ghddsj'][0..9]}</td><td>#{xcqy[k]['ghddh']}</td><td>#{xcqy[k]['zzysj'][0..9]}</td><td>#{xcqy[k]['zzypwh']}</td><td>#{xcqy[k]['gdsj'][0..9]}</td><td>#{xcqy[k]['gdpwh']}</td><td>#{xcqy[k]['pzyt']}</td><td>#{xcqy[k]['sjyt']}</td><td>#{xcqy[k]['pzmj']}</td><td>#{xcqy[k]['gdmj']}</td><td>#{xcqy[k]['dgsj']}</td><td>#{xcqy[k]['jszt']}</td><td>#{xcqy[k]['sjzdmj']}</td><td>#{xcqy[k]['sjgdmj']}</td><td>#{xcqy[k]['wfmj']}</td><td>#{xcqy[k]['xcjg']}</td><td>#{xcqy[k]['clyj']}</td><td>#{xcqy[k]['bz']}</td></tr>"
        

        txt=txt + "{'xczt':'" + xcqy[k]['xcqy'] + "',"
        txt=txt + "'xcry':'" + xcqy[k]['xcry']  + "',"
        txt=txt + "'yddw':'" + xcqy[k]['yddw']  + "',"
        txt=txt + "'sffhgh':'" + xcqy[k]['sffhztgh']  + "',"
        txt=txt + "'czqk':'" + xcqy[k]['clyj'] + "',"
        txt=txt + "'ydl':'" + xcqy[k]['ydl'] + "',"
        txt=txt + "'xcjg':'" + xcqy[k]['xcjg'] + "',"
        txt=txt + "'wfmj':'" + xcqy[k]['wfmj'] + "',"
        txt=txt + "'sjgd':'" + xcqy[k]['sjgdmj'] + "',"
        txt=txt + "'sjzd':'" + xcqy[k]['sjzdmj'] + "',"
        txt=txt + "'jsqk':'" + xcqy[k]['jszt'] + "',"
        txt=txt + "'dgsj':'" + xcqy[k]['dgsj'] + "',"
        txt=txt + "'pzgd':'" + xcqy[k]['gdmj'] + "',"
        txt=txt + "'pzmj':'" + xcqy[k]['pzmj'] + "',"
        txt=txt + "'sjyt':'" + xcqy[k]['sjyt'] + "',"
        txt=txt + "'pzyt':'" + xcqy[k]['pzyt'] + "',"
        txt=txt + "'gdpwh':'" + xcqy[k]['gdsj'].to_s + xcqy[k]['gdpwh'].to_s + "',"
        txt=txt + "'zzpwh':'" + xcqy[k]['zzysj'].to_s + xcqy[k]['zzypwh'].to_s + "',"
        txt=txt + "'ghwh':'" + xcqy[k]['ghddsj'].to_s + xcqy[k]['ghddh'].to_s + "',"
        txt=txt + "'lxpwh':'" + xcqy[k]['lxsj'].to_s + xcqy[k]['lxpwh'].to_s + "',"
        txt=txt + "'xmzl':'" + xcqy[k]['tdzl'] + "'"
        txt=txt + ",'xcqy':'" + xcqy[k]['xcqy'] + "',"
        txt=txt + "'xmmc':'" + xcqy[k]['xmmc'] + "',"
        txt=txt + "'xcsj':'#{xcqy[k]['xcrq']}'},"
      end 
      txt=txt + "]}"     
    else
      txt = "{results:0,rows:[]}"
    end
    xls=xls + "</table>"
    pr_path="./public/images"
    system("rm #{pr_path}/ysjl.xls")
    ff = File.open(pr_path + "/ysjl.xls" ,'w+')
    ff.write(xls)
    ff.close
    render :text => txt
  end
 
  
  #=== Add on Feb.24
  # {"gid"=>"247"}
  def get_plan_xmdks
    user = User.find_by_sql("select * from xmdks where gid=#{params['gid']};")
    
    if user.size > 0
      xmdk = user[0]
      txt = "<div style='maring:3px'>
      <table cellpadding=8>
        <tr>
          <th width='100px' height='20' >名称</th>
          <th>值</th>
        </tr>
        <tr>
          <td height='20'>地块ID:</td>
          <td>#{xmdk.gid}</td>
        </tr>
        <tr>
          <td height='20'>项目名称:</td>
          <td>#{xmdk.xmmc}</td>
        </tr>
        <tr>
          <td height='20'>批准文号:</td>
          <td>#{xmdk.pzwh}</td>
        </tr>
        <tr>
          <td height='20'>是否建设:</td>
          <td>#{xmdk.sfjs}</td>
        </tr>
        <tr>
          <td height='20'>用地单位:</td>
          <td>#{xmdk.yddw}</td>
        </tr>
        <tr>
          <td height='20'>土地坐落:</td>
          <td>#{xmdk.tdzl}</td>
        </tr>
        <tr>
          <td height='20'>地块面积:</td>
          <td>#{xmdk.dkmj}</td>
        </tr>
        <tr>
          <td height='20'>行政区名称:</td>
          <td>#{xmdk.xzqmc}</td>
        </tr>
        <tr>
          <td height='20'>图班面积:</td>
          <td>#{xmdk.shape_area}</td>
        </tr>
        <tr>
          <td height='20'>图班周长:</td>
          <td>#{xmdk.shape_len}</td>
        </tr>
        <tr>
          <td height='20' >地块号:</td>
          <td>#{xmdk.dkh}</td>
        </tr>
        <tr>
          <td height='20' >图幅号:</td>
          <td>#{xmdk.tfh}</td>
        </tr>
      </table></div>"
    else  
      txt = ""
    end
    render :text => txt
  end
  
  def get_xmdk_info
    render :text => "success"
  end  
  
  #plan_id
  def get_xg
    user = User.find_by_sql("select xmdks.gid, xmdks.xmmc from inspects, xmdks where plan_id =  #{params['plan_id']} and xmdks.gid = inspects.xmdk_id;")
    size = user.size;
    if size.to_i > 0
        txt = "{results:#{size},rows:["
        for k in 0..size-1
            txt = txt + user[k].to_json + ','
        end
        txt = txt[0..-2] + "]}"
    else 
      txt = "{results:0,rows:[]}"
    end
    render :text => txt  
  end  
  
  def get_my_chart
    txt = '{ "data": [
              { "host" : "192.168.200.145", "bytes" : 126633683,
                "direction" : "download"},
              { "host" : "192.168.200.145", "bytes" : 104069233,
                "direction" : "upload"},
              { "host" : "192.168.200.99", "bytes" : 55840235,
                "direction" : "download"},
              { "host" : "192.168.200.99", "bytes" : 104069233,
                "direction" : "upload"}
    ]}'
    
    render :text => txt;
  end 
  
  def get_chart_1
    user = User.find_by_sql("select id, rwmc, extract('epoch' from xcys)*1000 as xcsj, xclc  from plans where  device = '#{params['device']}' order by id;")
    size = user.size;
    if size.to_i > 0
        txt = "{results:#{size},rows:["
        for k in 0..size-1
            txt = txt + user[k].to_json + ','
        end
        txt = txt[0..-2] + "]}"
    else
        txt = "{results:0,rows:[]}"
    end
    render :text => txt
  end
  
  #按照月份来统计
  #s_rwmc, s_xcsj, s_xclc
  def get_chart_month
    user = User.find_by_sql("select to_char(taskbegintime,'YYYY年MM月') as s_rwmc, sum(xclc) as s_xclc, sum(extract('epoch' from xcys))*1000 as s_xcsj from plans where device = '#{params['device']}' group by s_rwmc order by s_rwmc;")
    
    size = user.size;
    if size.to_i > 0
        txt = "{results:#{size},rows:["
        for k in 0..size-1
            txt = txt + user[k].to_json + ','
        end
        txt = txt[0..-2] + "]}"
    else
        txt = "{results:0,rows:[]}"
    end
    render :text => txt
  end
  
  #按照季度来统计
  def get_chart_quarter
    user = User.find_by_sql("select to_char(taskbegintime,'YYYY年Q季') as s_rwmc, sum(xclc) as s_xclc, sum(extract('epoch' from xcys))*1000 as s_xcsj from plans where device = '#{params['device']}' group by s_rwmc order by s_rwmc;")
    
    size = user.size;
    if size.to_i > 0
        txt = "{results:#{size},rows:["
        for k in 0..size-1
            txt = txt + user[k].to_json + ','
        end
        txt = txt[0..-2] + "]}"
    else
        txt = "{results:0,rows:[]}"
    end
    render :text => txt
  end
  
  #按照年度来统计
  def get_chart_year
    user = User.find_by_sql("select to_char(taskbegintime,'YYYY年') as s_rwmc, sum(xclc) as s_xclc, sum(extract('epoch' from xcys))*1000 as s_xcsj from plans where device = '#{params['device']}' group by s_rwmc order by s_rwmc;")
    
    size = user.size;
    if size.to_i > 0
        txt = "{results:#{size},rows:["
        for k in 0..size-1
            txt = txt + user[k].to_json + ','
        end
        txt = txt[0..-2] + "]}"
    else
        txt = "{results:0,rows:[]}"
    end
    render :text => txt
  end
  
  #按个人进行分类, 
  def get_chart_51
    user = User.find_by_sql("select xcry, device, sum(xclc) as s_xclc, sum(extract('epoch' from xcys))*1000 as s_xcsj from plans where device is not null group by device, xcry  order by device;")
    size = user.size;
    if size.to_i > 0
        txt = "{results:#{size},rows:["
        for k in 0..size-1
            txt = txt + user[k].to_json + ','
        end
        txt = txt[0..-2] + "]}"
    else
        txt = "{results:0,rows:[]}"
    end
    render :text => txt
  end
  
  def get_chart_51_month
    user = User.find_by_sql("select xcry, device, sum(xclc) as s_xclc, sum(extract('epoch' from xcys))*1000 as s_xcsj from plans where device is not null and to_char(taskbegintime,'YYYY-DD') = '#{Time.now.strftime("%Y-%m")}' group by device, xcry  order by device;")
    size = user.size;
    if size.to_i > 0
        txt = "{results:#{size},rows:["
        for k in 0..size-1
            txt = txt + user[k].to_json + ','
        end
        txt = txt[0..-2] + "]}"
    else
        txt = "{results:0,rows:[]}"
    end
    render :text => txt
  end
  
  def get_chart_51_quarter
    user = User.find_by_sql("select xcry, device, sum(xclc) as s_xclc, sum(extract('epoch' from xcys))*1000 as s_xcsj from plans where device is not null and to_char(taskbegintime,'YYYY-Q') = '#{Time.now.strftime("%Y-")+[1, 2, 3, 4][(Time.now.month - 1) / 3].to_s}' group by device, xcry  order by device;")
    size = user.size;
    if size.to_i > 0
        txt = "{results:#{size},rows:["
        for k in 0..size-1
            txt = txt + user[k].to_json + ','
        end
        txt = txt[0..-2] + "]}"
    else
        txt = "{results:0,rows:[]}"
    end
    render :text => txt
  end
  
  def get_chart_51_year
    user = User.find_by_sql("select xcry, device, sum(xclc) as s_xclc, sum(extract('epoch' from xcys))*1000 as s_xcsj from plans where device is not null and to_char(taskbegintime,'YYYY') = '#{Time.now.year}' group by device, xcry  order by s_xcsj desc;")
    size = user.size;
    if size.to_i > 0
        txt = "{results:#{size},rows:["
        for k in 0..size-1
            txt = txt + user[k].to_json + ','
        end
        txt = txt[0..-2] + "]}"
    else
        txt = "{results:0,rows:[]}"
    end
    render :text => txt
  end        
  
  #年度--部门--人员
  def get_bmtree
    text = []
    node = params["node"].chomp
    if node == "root"
      data = User.find_by_sql("select distinct EXTRACT( YEAR from zrq) as year, count(*) from plans group by year;")
      
      data.each do |dd|
        text << {:text => "#{dd["year"]}年", :id => dd["year"], :cls  => "folder", :leaf => false}
      end
      
    else
      ss = node.split('|')
      if ss.size == 1
         data = User.find_by_sql("select distinct xcqy, count(*) from plans where EXTRACT( YEAR from zrq) = '#{ss[0]}' group by xcqy order by xcqy;")
         data.each do |dd|
           text << {:text => dd["xcqy"], :id => "#{ss[0]}|#{dd['xcqy']}", :cls  => "folder", :leaf => false}
         end  
      elsif ss.size == 2
        data = User.find_by_sql("select distinct xcry, count(*) from plans where EXTRACT( YEAR from zrq) = '#{ss[0]}' and xcqy = '#{ss[1]}' group by xcry order by xcry;")
        data.each do |dd|
          text << {:text => dd["xcry"], :id => "#{ss[0]}|#{ss[1]}|#{dd['xcry']}", :cls  => "folder", :leaf => true}
        end  
      end
      
    end
        
    render :text => text.to_json 
  end
  
  
  #年度--zt--部门--人员
  def get_zxtree
    text = []
    node = params["node"].chomp
    if node == "root"
      data = User.find_by_sql("select distinct EXTRACT( YEAR from zrq) as year, count(*) from plans where zt is not null group by year;")
      data.each do |dd|
        text << {:text => "#{dd["year"]}年", :id => dd["year"], :cls  => "folder", :leaf => false}
      end
    else
      ss = node.split('|')
      if ss.size == 1
        data = User.find_by_sql("select distinct zt, count(*) from plans where EXTRACT( YEAR from zrq) = '#{ss[0]}' and zt is not null group by zt order by zt;")
        data.each do |dd|
          text << {:text => dd["zt"], :id => "#{ss[0]}|#{dd['zt']}", :cls  => "folder", :leaf => false}
        end
      elsif ss.size == 2
         data = User.find_by_sql("select distinct xcqy, count(*) from plans where EXTRACT( YEAR from zrq) = '#{ss[0]}' and zt = '#{ss[1]}' group by xcqy order by xcqy;")
         data.each do |dd|
           text << {:text => dd["xcqy"], :id => "#{ss[0]}|#{ss[1]}|#{dd['xcqy']}", :cls  => "folder", :leaf => false}
         end  
      elsif ss.size == 3
        data = User.find_by_sql("select distinct xcry, count(*) from plans where EXTRACT( YEAR from zrq) = '#{ss[0]}' and zt = '#{ss[1]}'  and xcqy = '#{ss[2]}' group by xcry order by xcry;")
        data.each do |dd|
          text << {:text => dd["xcry"], :id => "#{ss[0]}|#{ss[1]}|#{ss[2]}|#{dd['xcry']}", :cls  => "folder", :leaf => true}
        end  
      end
    end
        
    render :text => text.to_json
  end
  
  #年度--zt2-部门--人员
  def get_rwtree
    text = []
    node = params["node"].chomp
    if node == "root"
      data = User.find_by_sql("select distinct EXTRACT( YEAR from zrq) as year, count(*) from plans where zt2 is not null group by year;")
      data.each do |dd|
        text << {:text => "#{dd["year"]}年", :id => dd["year"], :cls  => "folder", :leaf => false}
      end
    else
      ss = node.split('|')
      if ss.size == 1
        data = User.find_by_sql("select distinct zt2, count(*) from plans where EXTRACT( YEAR from zrq) = '#{ss[0]}' and zt2 is not null group by zt2 order by zt2;")
        data.each do |dd|
          text << {:text => dd["zt2"], :id => "#{ss[0]}|#{dd['zt2']}", :cls  => "folder", :leaf => false}
        end
      elsif ss.size == 2
         data = User.find_by_sql("select distinct xcqy, count(*) from plans where EXTRACT( YEAR from zrq) = '#{ss[0]}' and zt2 = '#{ss[1]}' group by xcqy order by xcqy;")
         data.each do |dd|
           text << {:text => dd["xcqy"], :id => "#{ss[0]}|#{ss[1]}|#{dd['xcqy']}", :cls  => "folder", :leaf => false}
         end  
      elsif ss.size == 3
        data = User.find_by_sql("select distinct xcry, count(*) from plans where EXTRACT( YEAR from zrq) = '#{ss[0]}' and zt2 = '#{ss[1]}'  and xcqy = '#{ss[2]}' group by xcry order by xcry;")
        data.each do |dd|
          text << {:text => dd["xcry"], :id => "#{ss[0]}|#{ss[1]}|#{ss[2]}|#{dd['xcry']}", :cls  => "folder", :leaf => true}
        end  
      end
    end
        
    render :text => text.to_json
  end  
  
  
  #username=
  def get_xmdks_store
    params['start']   = params['start'] || "0"
    params['limit']   = params['limit'] || "25"
    
    params['xz_tag']  = params['xz_tag'] || "全部"
    params['xcqy']    = params['xcqy']   || "全部"
    params['xcry']    = params['xcry']   || "全部"
    params['xcgl']    = params['xcgl']   || "全部"
    
    #params['username']    = params['username'] || "全部"
    
    cond, conds = [], ''
    
    if params['xz_tag'] == '是'
      cond << "xz_tag='是'"
      #cond << "xzqmc='#{params['xcqy']}'"        if params['xcqy'] != '全部'
      cond << "username='#{params['xcry']}'"     if params['xcry'] != '全部'
    else #system xmdks 
      cond << "(xz_tag != '是' or xz_tag is null)"
      cond << "xzqmc='#{params['xcqy']}'"        if params['xcqy'] != '全部'

      if params['xcry'] != '全部'
        if params['xcgl'] == '已巡查'
          cond << "gid in (select xmdk_id from inspects where iphone='#{params['xcry']}')" 
        elsif params['xcgl'] == '未巡查'
          cond << "gid not in (select xmdk_id from inspects where iphone='#{params['xcry']}')" 
        end
      else
          
      end    
    end
    
    conds = cond.size==1 ? "where #{cond[0]}" : "where #{cond.join(' and ')}"  if cond.size > 0
    
    user = User.find_by_sql("select count(*) from xmdks #{conds} ;")[0]
    size = user.count.to_i;
    if size > 0
      txt = "{results:#{size},rows:["
      puts "select * from xmdks #{conds} limit #{params['limit']} offset #{params['start']};"
      user = User.find_by_sql("select *, st_asgeojson(the_google)  as geom_string from xmdks #{conds} order by gid limit #{params['limit']} offset #{params['start']} ;")
      for k in 0..user.size-1
        txt = txt + user[k].to_json + ','
      end
      txt = txt[0..-2] + "]}"
    else
      txt = "{results:0,rows:[]}"
    end
    render :text => txt
  end
  
  #save basic plan data plan_id:plan_id, xclx:xclx, xcry:xcry, xcnr:xcnr, xcjg:xcjg, clyj:clyj
  def save_plan_basic
    User.find_by_sql("update plans set xclx = '#{params['xclx']}', xcry = '#{params['xcry']}', xcnr = '#{params['xcnr']}',xcjg = '#{params['xcjg']}', clyj = '#{params['clyj']}' where id = #{params['plan_id']};")
    render :text => 'Success' 
  end
  
  #pars = {jszt:jszt, xkz:xkz, yjx:yjx, sjyt:sjyt, gdmj:gdmj, sfwf:sfwf, wfmj:wfmj, clyj:clyj};
  def save_inspect_basic
    User.find_by_sql("update inspects set jszt = '#{params['jszt']}',sjyt = '#{params['sjyt']}', gdmj = '#{params['gdmj']}',sfwf = '#{params['sfwf']}', wfmj = '#{params['wfmj']}', clyj = '#{params['clyj']}' where id = #{params['inspect_id']};")
    render :text => 'Success'
  end
  
  #对应plan_Id 的 xmdk 
  #plan_id
  def get_xcd_xmdk
    user = User.find_by_sql("select xmdks.gid, xmdks.xmmc from inspects, xmdks where plan_id =  #{params['plan_id']} and xmdks.gid = inspects.xmdk_id;")
    size = user.size;
    if size.to_i > 0
        txt = "{results:#{size},rows:["
        for k in 0..size-1
            txt = txt + user[k].to_json + ','
        end
        txt = txt[0..-2] + "]}"
    else 
      txt = "{results:0,rows:[]}"
    end
    render :text => txt.gsub(" 00:00:00","")  
  end
  
  #get one row inspect data by gid  
  def get_inspect_data
    user = User.find_by_sql("select * from inspects where plan_id = #{params['plan_id']} and xmdk_id = #{params['xmdk_id']};")
    render :text => user.to_json
  end
  
  def get_xcd_box
    @xcds = User.find_by_sql("select xmdks.gid, xmdks.xmmc from inspects, xmdks where plan_id =  #{params['id']} and xmdks.gid = inspects.xmdk_id;")
    render :text => '123,456'
  end
  
  #gid for xmdks 
  def get_a_xmdks
    @a_xmdks = User.find_by_sql("select a_xmdks.* from a_xmdks, xmdks where a_xmdks.gdqkid = xmdks.gdqkid and xmdks.gid=#{params['gid']};")
    render :text => @a_xmdks.to_json.gsub(" 00:00:00", "")
  end
  
  #saveBasic pars = {gid:gid, xmmc:xmmc, yddw:yddw, pzwh:pzwh, sfjs:sfjs, tdzl:tdzl, dkmj:dkmj, xzqh:xzqh};
  def save_xmdks_basic
    User.find_by_sql("update xmdks set xmmc = '#{params['xmmc']}', yddw='#{params['yddw']}', pzwh = '#{params['pzwh']}', sfjs = '#{params['sfjs']}', tdzl = '#{params['tdzl']}', dkmj = '#{params['tdzl']}', xzqh = '#{params['xzqh']}' where gid = #{params['gid']};")
    render :text => 'Success'
  end
  
  def save_xmdks_extra
    
    User.find_by_sql("update a_xmdks set xmmc='#{params['xmmc']}', yddw='#{params['yddw']}', zlwz='#{params['zlwz']}', sffhztgh='#{params['sffhztgh']}', ydl='#{params['ydl']}', lxsj='#{params['lxsj']}', lxpwh='#{params['lxpwh']}', ghddsj='#{params['ghddsj']}', ghddh='#{params['ghddh']}', zzysj='#{params['zzysj']}', zzypwh='#{params['zzypwh']}', gdsj='#{params['gdsj']}', gdpwh='#{params['gdpwh']}', pzyt='#{params['pzyt']}', sjyt='#{params['sjyt']}', pzmj='#{params['pzmj']}', gdmj='#{params['gdmj']}', dgsj='#{params['dgsj']}'   where id = #{params['id']};")

    render :text => 'Success'
  end
  
  def save_xcjl_basic
    
    User.find_by_sql("update inspects set xcrq='#{params['xcrq']}',jszt='#{params['jszt']}',sjyt='#{params['sjyt']}',sfwf='#{params['sfwf']}',sjzdmj='#{params['sjzdmj']}',gdmj='#{params['gdmj']}',wfmj='#{params['wfmj']}',bz='#{params['bz']}' where id = #{params['id']};")
    
    render :text => 'Success'
  end

  def get_xstree_plan
    text = []
    node = params["node"].chomp
    
    username = params['username'];
    user = User.find_by_sql("select * from users where username = '#{username}';")[0]
   
    ss = node.split('|')
    if user.qxcode == '管理员'
      if node == "root"
        #text << {:text => user.dw, :id => user.dw, :cls  => "folder"}
        data = User.find_by_sql("select distinct dw, xzqmc from users;")
        data.each do |dd|
          text << {:text => dd["dw"], :id => "#{dd['xzqmc']}",  :cls  => "folder",  :leaf => false }  
        end
      else
        data = User.find_by_sql("select  bm || '-' || username as dwbm, xzqmc, username, iphone from users where (qxcode='巡查员' or qxcode='监察员') and xzqmc = '#{ss[0]}';")
        data.each do |dd|
          text << {:text => dd["dwbm"], :id => "#{dd['xzqmc']}|#{dd['username']}",  :iconCls => "text",  :leaf => true } 
        end
      end
    elsif user.qxcode == '监察员'  
      if node == "root"
        text << {:text => user.dw, :id => user.xzqmc, :cls  => "folder"}
      else
        data = User.find_by_sql("select  bm || '-' || username as dwbm, xzqmc, username, iphone from users where (qxcode='巡查员' or qxcode='监察员') and dw = '#{user.dw}';")
        data.each do |dd|
          text << {:text => dd["dwbm"], :id => "#{dd['xzqmc']}|#{dd['username']}",  :iconCls => "text",  :leaf => true }
        end
      end
    else user.qxcode == '巡查员'
      dd = user
      text << {:text => "#{dd["dw"]}-#{dd['bm']}-#{dd["username"]}", :id => "#{dd['xzqmc']}|#{dd['username']}",   :iconCls => "text",  :leaf => true }
    end    

    render :text => text.to_json
  end

  
  def get_xstree
    text = []
    node = params["node"].chomp
    
    username = params['username'];
    user = User.find_by_sql("select * from users where username = '#{username}';")[0]
   
    ss = node.split('|')
    if user.qxcode == '管理员'
      if node == "root"
        #text << {:text => user.dw, :id => user.dw, :cls  => "folder"}
        data = User.find_by_sql("select distinct dw,xzqmc from users;")
        data.each do |dd|
          text << {:text => dd["dw"], :id => "#{dd['xzqmc']}",  :cls  => "folder",  :leaf => false }  
        end
      else
        data = User.find_by_sql("select  bm || '-' || username as dwbm, xzqmc, username, iphone from users where (qxcode='巡查员' or qxcode='监察员') and xzqmc = '#{ss[0]}';")
        data.each do |dd|
          text << {:text => dd["dwbm"], :id => "#{dd['xzqmc']}|#{dd['iphone']}",  :iconCls => "text",  :leaf => true } 
        end
      end
    elsif user.qxcode == '监察员'  
      if node == "root"
        text << {:text => user.dw, :id => user.xzqmc, :cls  => "folder"}
      else
        data = User.find_by_sql("select  bm || '-' || username as dwbm, xzqmc, username, iphone from users where (qxcode='巡查员' or qxcode='监察员') and dw = '#{user.dw}';")
        data.each do |dd|
          text << {:text => dd["dwbm"], :id => "#{dd['xzqmc']}|#{dd['iphone']}",  :iconCls => "text",  :leaf => true }
        end
      end
    else user.qxcode == '巡查员'
      dd = user
      text << {:text => "#{dd["dw"]}-#{dd['bm']}-#{dd["username"]}", :id => "#{dd['xzqmc']}|#{dd['iphone']}",   :iconCls => "text",  :leaf => true }
    end    

    render :text => text.to_json
  end
  
  def get_xcjl_xmdk
    user = User.find_by_sql("select * from inspects where xmdk_id = #{params['xmdk_id']}")
    size = user.size;
    if size > 0
      txt = "{results:#{size},rows:["
      for k in 0..user.size-1
        txt = txt + user[k].to_json + ','
      end
      txt = txt[0..-2] + "]}"
    else
      txt = "{results:0,rows:[]}"
    end
    render :text => txt
  end
  
  
  def delete_selected_xmdks
    params['id'].split(",").each do |dd|
      user = User.find_by_sql("select count(*) from inspects where xmdk_id=#{dd};")
      if user[0].count.to_i == 0
        xmdk = User.find_by_sql("select * from xmdks where gid = #{dd};")
        User.find_by_sql("delete from a_xmdks where gdqkid = '#{xmdk[0].gdqkid}';")
        User.find_by_sql("delete from xmdks where gid = #{dd}");
      end  
    end
    render :text => 'Success'
  end
  
  
  #plan_id, xmdk_id
  def get_xcimage_json
    params['plan_id'] = params['plan_id'] || "全部"
    params['xmdk_id'] = params['xmdk_id'] || "全部"
    
    cond, conds = [], ''
    cond << "plan_id=#{params['plan_id']}" if params['plan_id'] != '全部'
    cond << "xmdk_id=#{params['xmdk_id']}" if params['xmdk_id'] != '全部'

    conds = cond.size==1 ? "where #{cond[0]}" : "where #{cond.join(' and ')}"  if cond.size > 0
    
    user = User.find_by_sql("select id, yxmc, rq, tpjd, bz from xcimage #{conds};")
    
    size = user.size;
    if size > 0
      txt = "{results:#{size},rows:["
      for k in 0..user.size-1
        txt = txt + user[k].to_json + ','
      end
      txt = txt[0..-2] + "]}"
    else
      txt = "{results:0,rows:[]}"
    end
    render :text => txt.gsub('.PNG', '-thumb.jpg').gsub('.JPG', '-thumb.jpg')
  end
  
  #show current active users;
  def get_active_lines
    user = User.find_by_sql("select id, astext(the_lines) as lon_lat, username, device, report_at, session_id from plans where zt = '执行' and the_lines is not null order by report_at desc;")
    render :text => user.to_json
  end
  
  # 部门， 人员， 路线, 
  def get_activeUser
    text = []
    node = params["node"]
    
    username = params['username'];
    user = User.find_by_sql("select * from users where username = '#{username}';")[0]


    if user.qxcode == '管理员'
      if node == "root"
        data = User.find_by_sql("select plans.id, xcbh, rwmc, plans.username, dw, bm from plans, users where plans.username = users.username and (now() - interval '12 hour') < last_seen and dw = '#{user.dw}' order by dw;")
        data.each do |dd|
          text << {:text => " #{dd['dw']}-#{dd['rwmc']} ", :id => "#{dd["id"]}", :iconCls => "online",  :leaf => true }
        end
      end
    else user.qxcode = '监察员'
      if node == "root"
        data = User.find_by_sql("select plans.id, xcbh, rwmc, plans.username, dw, bm from plans, users where plans.username = users.username and (now() - interval '12 hour') < last_seen and dw = '#{user.dw}' and  dw = '#{user.dw}' order by rwmc;")
        data.each do |dd|
          text << {:text => " #{dd['dw']}-#{dd['rwmc']} ", :id => "#{dd["id"]}", :iconCls => "online",  :leaf => true}
        end
      end
    end
    render :text => text.to_json
  end
  
  def get_active_lines_by_id
    user = User.find_by_sql("select id, astext(the_lines) as lon_lat, username, device, report_at, session_id from plans where id = #{params['id']};")
    render :text => user.to_json
  end
    
end