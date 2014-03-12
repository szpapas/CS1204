class YdbController < ApplicationController
  skip_before_filter :verify_authenticity_token
  before_filter :authenticate_user!, :except => []
  before_filter :set_current_user
  
  def index
  end
  
  def get_yd_tree
    text = []
    if params['id'].nil? #root node
      data = User.find_by_sql("select distinct cx from ydbs;")
      data.each do |dd|
        text << {:id => "#{dd['cx']}",  :text => dd["cx"], :iconCls  => "icon-folderClose",  :state => "closed" }  
      end

    else 
      node_id = params['id']
      ss = node_id.split('|')
      if ss.size == 1 
        data = User.find_by_sql("select distinct yt from ydbs where cx='#{ss[0]}' order by yt;")
        data.each do |dd|
          text << {:id => "#{ss[0]}|#{dd['yt']}",  :text => dd["yt"], :iconCls  => "icon-folderClose",  :state => "closed" }  
        end
      else 
        data = User.find_by_sql("select srf, id from ydbs where cx='#{ss[0]}' and yt='#{ss[1]}' order by srf;")
        data.each do |dd|
          text << {:id => "#{dd["id"]}",  :text => dd["srf"], :iconCls  => "icon-map",  :state => "open" }  
        end
      end
    end  

    render :text => text.to_json
  end  
  
  def get_ydb_grid
    cond = []
    
    page = params['page']
    rows = params['rows']
    
    offset = (page.to_i-1)*rows.to_i
    
    cond << "cx = '#{params['cx']}' "   if params['cx'] != ''
    cond << "yt = '#{params['yt']}' "  if params['yt'] != ''
    cond << "srf like '%#{params['filter']}%' " if params['filter'] != ''
    
    cond_str  = ''
    cond_str = "where " + cond.join(" and ") if cond.size > 0;
    
    total = User.find_by_sql("select count(*) from ydbs #{cond_str};")[0].count 
    user = User.find_by_sql("select *, ydjkrq - date (now()) as days from ydbs #{cond_str} order by id offset #{offset} limit #{rows};")
    
    render :text => {"total" => total, "rows" => user}.to_json
  end
  
  def ydb_dd
    if params['id'].nil?
      render :template => "error.html.erb"
    else
      params['id'] = -1 if params['id'] == ''
      @ydb = User.find_by_sql("select * from ydbs where id = #{params['id']}")
      if @ydb != nil
        @ydb = @ydb[0]
        @fqs = User.find_by_sql("select * from ydb_fq where ydb_id = #{@ydb['id']} order by id;")
      end  
    end
  end
  
  def save_ydb
    
    params['crfapzrq'] = params['crfapzrq'] == '' ? "NULL" : "TIMESTAMP '#{params['crfapzrq']}'"
    params['sjjgsj'] = params['sjjgsj'] == '' ? "NULL" : "TIMESTAMP '#{params['sjjgsj']}'"
    params['ydjgsj'] = params['ydjgsj'] == '' ? "NULL" : "TIMESTAMP '#{params['ydjgsj']}'"
    params['sjjdsj'] = params['sjjdsj'] == '' ? "NULL" : "TIMESTAMP '#{params['sjjdsj']}'"
    params['ydjdsj'] = params['ydjdsj'] == '' ? "NULL" : "TIMESTAMP '#{params['ydjdsj']}'"
    params['sjkgsj'] = params['sjkgsj'] == '' ? "NULL" : "TIMESTAMP '#{params['sjkgsj']}'"
    params['gdrq'] = params['gdrq'] == '' ? "NULL" : "TIMESTAMP '#{params['gdrq']}'"
    params['cjrq'] = params['cjrq'] == '' ? "NULL" : "TIMESTAMP '#{params['cjrq']}'"
    params['ggrq'] = params['ggrq'] == '' ? "NULL" : "TIMESTAMP '#{params['ggrq']}'"
    params['qdhtrq'] = params['qdhtrq'] == '' ? "NULL" : "TIMESTAMP '#{params['qdhtrq']}'"
    params['ydkgsj'] = params['ydkgsj'] == '' ? "NULL" : "TIMESTAMP '#{params['ydkgsj']}'"
    params['sjjkrq'] = params['sjjkrq'] == '' ? "NULL" : "TIMESTAMP '#{params['sjjkrq']}'"
    params['ydjkrq'] = params['ydjkrq'] == '' ? "NULL" : "TIMESTAMP '#{params['ydjkrq']}'"
                                                                                              
    if params['ydb_id']=="" ||  params['ydb_id']=="-1"
      user = User.find_by_sql("insert into ydbs (cx, gdfs, crfapzrq, ggrq, cjrq, qdhtrq, gdrq, cjqrsbh, htbh, pfwh, crf, srf, xmfzr, fzrdh, lxr, dh, jsxmmc, dkwz, dkbh, zdmj, dkdz, dkxz, dknz, dkbz, pgj, dj_dj, dj_mwj, dj_lmj, cjj_mwj, cjj_lmj, cjzj, yjl, cr, yt, cyml, qsly, tztx, bzj, ydjkrq, sjjkrq, znjqk, qkje, wdqk, cjqk, ydjdsj, sjjdsj, ydkgsj, sjkgsj, ydjgsj, sjjgsj, tze, zczb, rjl, jsmd, lhl, qtyq, kjjzmj, zxtxbl, zxtxmj, bz) values ('#{params['cx']}','#{params['gdfs']}',#{params['crfapzrq']}, #{params['ggrq']},#{params['cjrq']},#{params['qdhtrq']}, #{params['gdrq']},'#{params['cjqrsbh']}','#{params['htbh']}','#{params['pfwh']}','#{params['crf']}','#{params['srf']}','#{params['xmfzr']}','#{params['fzrdh']}','#{params['lxr']}','#{params['dh']}','#{params['jsxmmc']}','#{params['dkwz']}','#{params['dkbh']}','#{params['zdmj']}','#{params['dkdz']}','#{params['dkxz']}','#{params['dknz']}','#{params['dkbz']}','#{params['pgj']}','#{params['dj_dj']}','#{params['dj_mwj']}','#{params['dj_lmj']}','#{params['cjj_mwj']}','#{params['cjj_lmj']}','#{params['cjzj']}','#{params['yjl']}','#{params['cr']}','#{params['yt']}','#{params['cyml']}','#{params['qsly']}','#{params['tztx']}','#{params['bzj']}',#{params['ydjkrq']}, #{params['sjjkrq']},'#{params['znjqk']}','#{params['qkje']}','#{params['wdqk']}','#{params['cjqk']}', #{params['ydjdsj']},  #{params['sjjdsj']},  #{params['ydkgsj']}, #{params['sjkgsj']}, #{params['ydjgsj']}, #{params['sjjgsj']}, '#{params['tze']}','#{params['zczb']}','#{params['rjl']}','#{params['jsmd']}','#{params['lhl']}','#{params['qtyq']}','#{params['kjjzmj']}','#{params['zxtxbl']}','#{params['zxtxmj']}','#{params['bz']}') returning id;")
      ydb_id = user[0]['id']
    else 
      User.find_by_sql("update ydbs set cx='#{params['cx']}', gdfs='#{params['gdfs']}',crfapzrq = #{params['crfapzrq']}, ggrq = #{params['ggrq']}, cjrq = #{params['cjrq']}, qdhtrq = #{params['qdhtrq']}, gdrq = #{params['gdrq']}, cjqrsbh = '#{params['cjqrsbh']}', htbh = '#{params['htbh']}', pfwh = '#{params['pfwh']}', crf = '#{params['crf']}', srf = '#{params['srf']}', xmfzr = '#{params['xmfzr']}', fzrdh = '#{params['fzrdh']}', lxr = '#{params['lxr']}', dh = '#{params['dh']}',jsxmmc = '#{params['jsxmmc']}', dkwz = '#{params['dkwz']}', dkbh = '#{params['dkbh']}', zdmj = '#{params['zdmj']}', dkdz = '#{params['dkdz']}', dkxz = '#{params['dkxz']}', dknz = '#{params['dknz']}', dkbz = '#{params['dkbz']}', pgj='#{params['pgj']}', dj_dj='#{params['dj_dj']}',dj_mwj='#{params['dj_mwj']}',dj_lmj='#{params['dj_lmj']}',cjj_mwj='#{params['cjj_mwj']}',cjj_lmj='#{params['cjj_lmj']}',cjzj='#{params['cjzj']}',yjl='#{params['yjl']}', cr='#{params['cr']}', yt='#{params['yt']}', cyml='#{params['cyml']}', qsly='#{params['qsly']}', tztx='#{params['tztx']}', bzj='#{params['bzj']}', ydjkrq= #{params['ydjkrq']}, sjjkrq = #{params['sjjkrq']}, znjqk='#{params['znjqk']}', qkje='#{params['qkje']}',wdqk='#{params['wdqk']}',cjqk='#{params['cjqk']}',ydjdsj= #{params['ydjdsj']}, sjjdsj = #{params['sjjdsj']}, ydkgsj= #{params['ydkgsj']}, sjkgsj=#{params['sjkgsj']}, ydjgsj= #{params['ydjgsj']}, sjjgsj= #{params['sjjgsj']}, tze='#{params['tze']}',zczb='#{params['zczb']}',rjl='#{params['rjl']}',jsmd='#{params['jsmd']}',lhl='#{params['lhl']}',qtyq='#{params['qtyq']}', kjjzmj= '#{params['kjjzmj']}',zxtxbl='#{params['zxtxbl']}',zxtxmj='#{params['zxtxmj']}',bz='#{params['bz']}'   where id = #{params['ydb_id']};")
      ydb_id = params['ydb_id'].to_i
    end    
    render :text => "#{ydb_id}"
  end
  
  
  def jsyd_pdf
    ydb_id = params['id']
    puts("ruby ./dady/bin/pdf_jsyd.rb #{ydb_id}")
    system("ruby ./dady/bin/pdf_jsyd.rb #{ydb_id}")
    render :text => "/images/dady/yd_xkz/jsyd_#{ydb_id}.pdf"
  end
  
  def jsyd_pdf2
    ydb_id = params['id']
    puts("ruby ./dady/bin/pdf_jsyd.rb #{ydb_id}")
    system("ruby ./dady/bin/pdf_jsyd.rb #{ydb_id}")
    redirect_to "/images/dady/yd_xkz/jsyd_#{ydb_id}.pdf"
  end
  
  #{"id"=>"1", "points"=>"LINESTRING(13418996.149928998 3714637.9865068975,13418756.089887 3714571.1041072025,13418672.486887002 3714786.083249198,13418838.498557998 3714841.0223633,13418855.219158 3714764.5853349976,13418996.149928998 3714637.9865068975)"}
  def save_zb
    poly_str = params['points'].gsub('LINESTRING','POLYGON(')+')'
    User.find_by_sql("update ydbs set the_geom = transform(geomFromText('#{poly_str}',900913),2364);")
    render :text => 'Success'
  end
  
  def load_xmdk
    xmdk_str = User.find_by_sql("select x(transform(centroid(the_geom), 4326)) as lng, y(transform(centroid(the_geom), 4326)) as lat, st_asgeojson(transform(the_geom,4326)) as geom_string from ydbs where id = #{params['id']};")
    render :text => xmdk_str.to_json #.gsub('],[',"\n").gsub(/\[|\]/,'')
  end
  
  
  def upload_gh_file
    u_id = params['user_id']
    ydb_id = params['ydb_id']
    
    txt = ''
    params.each do |k,v|
      logger.debug("K: #{k} ,V: #{v}")

      if k.include?("files")
        pathname = "./dady/ghtx/#{ydb_id}_#{v[0].original_filename}"
        ff = File.new(pathname,"w+")
        ff.write(v[0].tempfile.read)
        ff.close

        system ("convert #{pathname} #{pathname.gsub(/PNG|JPG/i,'jpg')}")

        yxmc = "#{ydb_id}_#{v[0].original_filename}"
        
        img_id = User.find_by_sql("insert into gh_image (ydb_id, yxmc, rq) values (#{ydb_id}, '#{yxmc}', TIMESTAMP '#{Time.now.strftime('%Y-%m-%d %H:%m:%S')}') returning id;")[0].id
        
        @img = User.find_by_sql("select id, yxmc, rq, tpjd, bz from gh_image where id = '#{img_id}';")[0];
        txt = @img.to_json
      end
    end
    render :text => txt
  end
  
  def del_gh_photo
    user = User.find_by_sql("delete from gh_image where id = #{params['id']};")
    render :text => 'Success'
  end
  
  def get_gh_list
    @imgs = User.find_by_sql("select id, yxmc, rq, tpjd, bz from gh_image where ydb_id = #{params['id']}");
    render :text => @imgs.to_json
  end
  
  #cx:cx, ggrq_ks:ggrq_ks, ggrq_js:ggrq_js, crj_1:crj_1, crj_2:crj_2}
  def get_select_ydb_list
    cond = []
    cond << "cx = '#{params['cx']}' "   if params['cx'] != ''
    cond << "ggrq > TIMESTAMP '#{params['ggrq_ks']}' "  if params['ggrq_ks'] != ''
    cond << "ggrq < TIMESTAMP '#{params['ggrq_js']}' "  if params['ggrq_js'] != ''

    cond << "cast (cjzj as integer) > #{params['crj_1']} "  if params['crj_1'] != ''
    cond << "cjzj (cjzj as integer) < #{params['crj_2']} "  if params['crj_2'] != ''
    
    cond_str  = ''
    cond_str = "where " + cond.join(" and ") if cond.size > 0;
    
    total = User.find_by_sql("select count(*) from ydbs #{cond_str};")[0].count 
    ydb_list = User.find_by_sql("select * from ydbs #{cond_str} order by id ");

    render :text => ydb_list.to_json
  end
  
  def export
    @ydb = Ydb.find_by_sql("select * from ydbs order by id;");
    respond_to do |format|
      format.html
      format.csv { send_data @ydb.to_csv }
      format.xls # { send_data @products.to_csv(col_sep: "\t") }
    end
  end  
  
  def export_selected
    ids = params['ids']
    @ydb = Ydb.find_by_sql("select * from ydbs where id in (#{ids}) order by id;")
    book = Spreadsheet::Workbook.new
    sheet = book.create_worksheet :name => "ydb"
    # write speadsheet
    
    sheet.row(0).push '用地表','创建时间：', Time.now().strftime("%F %T") 
    sheet.row(2).push '城乡','供地方式','出让(流转)方案批准日期','公告日期','成交日期','签订合同日期','供地日期','成交确认书编号','合同(划拨决定书)编号','批复文号','出让(流转)方','受让方','联系人','电话','建设项目名称','地块位置','地块编号','宗地面积','评估价','底价(单价)','底价(亩/万元)','底价(起始总价)','底价(楼面价)','成交价(单价)','成交价(亩/万元),','成交价(楼面价),','成交总价','溢价率','出让(流转)年限','用途','产业门类','权属来源','投资体系','保证金,','约定交款时间','实际交款时间','滞纳金情况','欠款金额','未到期款','催缴情况','约定交地时间','实际交地时间','约定开工时间','实际开工时间','约定竣工时间','实际竣工时间','投资额','注册资本','容积率','建设密度','绿化率','其他要求','可建建筑面积','中小套型比例','中小套型面积','备注','地块东至','地块西至','地块南至','地块北至'
    
    row_id = 2
    @ydb.each do |ydb|
      row_id = row_id + 1
      sheet.row(row_id).push ydb.cx,ydb.gdfs, ydb.crfapzrq.nil? ? '' : ydb.crfapzrq.strftime("%F"), ydb.ggrq.nil?? '' : ydb.ggrq.strftime("%F"), ydb.cjrq.nil?? '' : ydb.cjrq.strftime("%F"), ydb.qdhtrq.nil? ? '' : ydb.qdhtrq.strftime("%F"), ydb.gdrq.nil?? '' : ydb.gdrq.strftime("%F"), ydb.cjqrsbh, ydb.htbh, ydb.pfwh, ydb.crf,ydb.srf,ydb.lxr,ydb.dh,ydb.jsxmmc, ydb.dkwz, ydb.dkbh, ydb.zdmj, ydb.pgj,ydb.dj_dj,ydb.dj_mwj, ydb.dj_qszj, ydb.dj_lmj, ydb.cjj_dj, ydb.cjj_mwj, ydb.cjj_lmj, ydb.cjzj, ydb.yjl,ydb.cr,ydb.yt,ydb.cyml, ydb.qsly, ydb.tztx, ydb.bzj,ydb.ydjkrq.nil? ? '' : ydb.ydjkrq.strftime("%F"), ydb.sjjkrq.nil? ? '' : ydb.sjjkrq.strftime("%F"), ydb.znjqk,ydb.qkje, ydb.wdqk, ydb.cjqk, ydb.ydjdsj.nil? ? '' : ydb.ydjdsj.strftime("%F"), ydb.sjjdsj.nil? ? '' : ydb.sjjdsj.strftime("%F"), ydb.ydkgsj.nil? ? '' : ydb.ydkgsj.strftime("%F"), ydb.sjkgsj.nil? ? '' : ydb.sjkgsj.strftime("%F"), ydb.ydjgsj.nil? ? '' : ydb.ydjgsj.strftime("%F"), ydb.sjjgsj.nil? ? '' : ydb.sjjgsj.strftime("%F"), ydb.tze,ydb.zczb, ydb.rjl,ydb.jsmd, ydb.lhl,ydb.qtyq, ydb.kjjzmj, ydb.zxtxbl, ydb.zxtxmj, ydb.bz,ydb.dkdz, ydb.dkxz, ydb.dknz, ydb.dkbz
    end  
    
    #sheet[1,0] = 'Japan'
    #row = sheet.row(1)
    #row.push 'Creator of Ruby'
    #row.unshift 'Yukihiro Matsumoto'
    #sheet.row(2).replace [ 'Daniel J. Berger', 'U.S.A.',
    #                        'Author of original code for Spreadsheet::Excel' ]
    #sheet.row(3).push 'Charles Lowe', 'Author of the ruby-ole Library'
    #sheet.row(3).insert 1, 'Unknown'
    #sheet.update_row 4, 'Hannes Wyss', 'Switzerland', 'Author'
      
    book.write "./export.xls"
    send_file "./export.xls", :type => "application/vnd.ms-excel", :filename => "export.xls", :stream => false
    File.delete("./export.xls")
  end  
end
